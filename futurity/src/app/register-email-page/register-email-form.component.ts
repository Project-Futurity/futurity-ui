import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";

@Component({
  selector: 'app-register-email-page',
  templateUrl: './register-email-form.component.html',
  styleUrls: ['./register-email-form.component.css']
})
export class RegisterEmailFormComponent implements OnInit {
  emailInputForm: FormGroup;
  disableContinueButton = false;
  emailError: string = null;
  @Output() closeEvent = new EventEmitter<string>();

  constructor(private emailService: EmailService) {}

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
    this.closeEvent.emit(this.emailInputForm.value.email);
    this.emailError = "This email is already taken";
    this.disableContinueButton = true; // disable the button while requesting to the server
    // this.emailService.setEmail(this.emailInputForm.value);
    // this.router.navigate(["/register"]);
    // submit email
  }
}
