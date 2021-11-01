import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register-email-page',
  templateUrl: './register-email-page.component.html',
  styleUrls: ['./register-email-page.component.css']
})
export class RegisterEmailPageComponent implements OnInit {
  emailInputGroup: FormGroup;
  disableContinueButton = false;
  emailError: string = null;


  ngOnInit() {
    this.emailInputGroup = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])")
      ])
    });
  }

  onSubmit() {
    this.emailError = "This email is already taken";
    this.disableContinueButton = true; // disable the button while requesting to the server
    // submit email
  }
}
