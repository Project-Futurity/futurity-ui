import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-register-email-page',
  templateUrl: './register-email-page.component.html',
  styleUrls: ['./register-email-page.component.css']
})
export class RegisterEmailPageComponent implements OnInit {
  emailInputGroup: FormGroup;
  disableContinueButton = false;
  emailError: string = null;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.emailInputGroup = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.auth.EMAIL_REGEX)
      ])
    });
  }

  onSubmit() {
    this.emailError = "This email is already taken";
    this.disableContinueButton = true; // disable the button while requesting to the server
    // submit email
  }
}
