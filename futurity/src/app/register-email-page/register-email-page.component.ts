import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-email-page',
  templateUrl: './register-email-page.component.html',
  styleUrls: ['./register-email-page.component.css']
})
export class RegisterEmailPageComponent implements OnInit {
  emailInputForm: FormGroup;
  disableContinueButton = false;
  emailError: string = null;

  constructor(private emailService: EmailService, private router: Router) {}

  ngOnInit() {
    this.emailInputForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailService.EMAIL_REGEX)
      ])
    });

    this.emailInputForm.setValue({
      email: this.emailService.getEmail()
    });
  }

  onSubmit() {
    this.emailError = "This email is already taken";
    this.disableContinueButton = true; // disable the button while requesting to the server
    this.emailService.setEmail(this.emailInputForm.value);
    this.router.navigate(["/register"]);
    // submit email
  }
}
