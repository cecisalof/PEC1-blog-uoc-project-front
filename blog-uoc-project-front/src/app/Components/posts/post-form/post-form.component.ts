import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { PostDTO } from 'src/app/Models/post.dto';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  post: PostDTO;
  title: FormControl;
  description: FormControl;
  publication_date: FormControl;
  categories: CategoryDTO[] = [];
  // FormControl for categories with custom validator. Tracks the value and validation status of an individual form control.
  categoryControl: FormControl;
  postForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;

  constructor(
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = {} as PostDTO;
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new FormControl('', [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.publication_date = new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]);

    this.categoryControl = new FormControl([], [this.minimumSelected(1)]);

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categoryControl: this.categoryControl, // with custom validator applied
    });
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    // load categories for the select input
    await this.loadCategories();

    // update
    if (this.postId) {
      this.isUpdateMode = true;
      try {
        this.post = await this.postService.getPostById(
          this.postId
        );

        this.title.setValue(this.post.title);
        this.description.setValue(this.post.description);

        // 🔹 Aquí formateamos la fecha correctamente
        const formattedDate = this.datePipe.transform(this.post.publication_date, 'yyyy-MM-dd');
        this.publication_date.setValue(formattedDate);

        this.categoryControl.setValue(this.post.categories.map(c => c.categoryId));

        this.postForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          publication_date: this.publication_date,
          categories: this.categories,
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  async loadCategories(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (!userId) return;

    try {
      this.categories = await this.categoryService.getCategoriesByUserId(userId);
      console.log('this.categories', this.categories);
    } catch (error: any) {
      const errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  minimumSelected(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length >= min ? null : { required: true };
    };
  }


  private async editPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;
    if (this.postId) {
      const userId = this.localStorageService.get('user_id');
      if (userId) {
        this.post.userId = userId;
        try {
          await this.postService.updatePost(
            this.postId,
            this.post
          );
          responseOK = true;
        } catch (error: any) {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }

        await this.sharedService.managementToast(
          'postFeedback',
          responseOK,
          errorResponse
        );

        if (responseOK) {
          this.router.navigateByUrl('posts');
        }
      }
    }
    return responseOK;
  }

  private async createPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK: boolean = false;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.post.userId = userId;
      try {
        await this.postService.createPost(this.post);
        responseOK = true;
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }

      await this.sharedService.managementToast(
        'postFeedback',
        responseOK,
        errorResponse
      );

      if (responseOK) {
        this.router.navigateByUrl('posts');
      }
    }

    return responseOK;
  }

  async savePost() {
    this.isValidForm = false;

    if (this.postForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.post = this.postForm.value;

    if (this.isUpdateMode) {
      this.validRequest = await this.editPost();
    } else {
      this.validRequest = await this.createPost();
    }
  }
}
