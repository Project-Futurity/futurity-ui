import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";

@Component({
  selector: 'app-register-email-page',
  templateUrl: './register-email-page.component.html',
  styleUrls: ['./register-email-page.component.css']
})
export class RegisterEmailPageComponent implements OnInit {
  emailInputForm: FormGroup;
  disableContinueButton = false;
  emailError: string = null;

  constructor(private email: EmailService) {
  }

  ngOnInit() {
    this.emailInputForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.email.EMAIL_REGEX)
      ])
    });

    this.emailInputForm.setValue({
      email: this.email.getEmail()
    });
  }

  onSubmit() {
    this.emailError = "This email is already taken";
    this.disableContinueButton = true; // disable the button while requesting to the server
    // submit email
  }
}
