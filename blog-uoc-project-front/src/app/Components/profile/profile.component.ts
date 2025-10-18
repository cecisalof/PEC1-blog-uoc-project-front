import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from 'src/app/Models/user.dto';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileUser: UserDTO;

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  profileForm: FormGroup;
  isValidForm: boolean | null;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {
    this.profileUser = {} as UserDTO;
    this.isValidForm = null;

    this.name = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.surname_1 = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.surname_2 = new FormControl('', [Validators.minLength(5), Validators.maxLength(25)]);
    this.alias = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.birth_date = new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]);
    this.email = new FormControl("", [Validators.required, Validators.email]);
    // explicar por qué no es required
    this.password = new FormControl("", [Validators.minLength(8), Validators.maxLength(16)]);


    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  async ngOnInit(): Promise<void> {

    let errorResponse: any;

    // load user data
    const userId = this.localStorageService.get('user_id');

    if (userId) {
      try {
        const userData = await this.userService.getUSerById(userId);

        this.profileForm.patchValue({
          name: userData.name,
          surname_1: userData.surname_1,
          surname_2: userData.surname_2,
          alias: userData.alias,
          birth_date: formatDate(userData.birth_date, 'yyyy-MM-dd', 'en'),
          email: userData.email
          // password: lo dejamos vacío
        });
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }

  }

  async updateUser(): Promise<void> {

    let responseOK: boolean = false;
    let errorResponse: any;
    this.isValidForm = false;
   

    if (this.profileForm.invalid) {
      console.log('Invalid form');
      return;
    }

    this.isValidForm = true;

    // Construimos el payload
    const payload: any = { // MAKE ANY A USERdTO TYPE
      ...this.profileForm.value
    };

    // Eliminamos password si está vacío (usuario no quiere cambiarla)
    if (!payload.password) {
      delete payload.password;
    }

    console.log("payload", payload);
    
    const userId = this.localStorageService.get('user_id');

    if (userId) {
      try {
        await this.userService.updateUser(userId, payload);
        responseOK = true;
      } catch (error: any) {
        responseOK = false;
        errorResponse = error.error;

        this.sharedService.errorLog(errorResponse);
      }
    }

    await this.sharedService.managementToast(
      'profileFeedback',
      responseOK,
      errorResponse
    );

  }
}
