import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  emailInputForm: FormGroup;

  constructor(private email: EmailService, private router: Router) {
  }

  ngOnInit() {
    this.emailInputForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.email.EMAIL_REGEX)
      ])
    });
  }

  onSubmit() {
    this.email.setEmail(this.emailInputForm.get('email').value);
    this.router.navigate(["/singup"]);
  }
}
