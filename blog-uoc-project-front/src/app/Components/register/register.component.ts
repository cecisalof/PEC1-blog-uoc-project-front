import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from 'src/app/Models/user.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerUser: UserDTO;
  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  registerForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router
  ) {

    //Crea un objeto vacío de tipo UserDTO.
    this.registerUser = {} as UserDTO;
    this.isValidForm = null;

    // Inicializar campos del formulario
    this.name = new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.surname_1 = new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(25)]);
    this.surname_2 = new FormControl("", [Validators.minLength(5), Validators.maxLength(25)]);
    this.alias = new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]);
    this.birth_date = new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]);
    this.email = new FormControl("", [Validators.required, Validators.email]);
    this.password = new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16)]);

    // formBuilder para agrupar los campos del formulario
    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void { }

  async register(): Promise<void> {

    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;
    // console.log(this.registerForm.value);
    // console.log(this.registerForm.errors);
    // console.log(this.registerForm.controls);

    if (this.registerForm.invalid) {
      console.log("Form is invalid");

      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    try {
      await this.userService.register(this.registerUser);
      responseOK = true;
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;

      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);

      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'registerFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      // Reset the form
      this.registerForm.reset();
      // After reset form we set birthDate to today again (is an example)
      this.birth_date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
      this.router.navigateByUrl('home');
    }
  }
}

