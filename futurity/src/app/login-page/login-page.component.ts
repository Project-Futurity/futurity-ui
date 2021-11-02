import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  showPassword = false;
  disableLoginButton = false;
  @ViewChild('password') input: ElementRef;
  loginForm: FormGroup;
  loginError: string = null;

  constructor(private email: EmailService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.email.EMAIL_REGEX)
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  togglePasswordView() {
    this.showPassword = !this.showPassword;
    this.input.nativeElement.type = this.showPassword ? "text" : "password";
  }

  onSubmit() {
    /* an error from the backend */
    this.loginError = "Incorrect email or password. Check the entered data";
    this.disableLoginButton = true; // disable the button while requesting to the server

    // login
  }
}
