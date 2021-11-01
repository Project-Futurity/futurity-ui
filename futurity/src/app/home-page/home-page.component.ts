import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  emailInputGroup: FormGroup;
  disableJoinButton = false;

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
    this.disableJoinButton = true; // disable the button while requesting to the server

    // submit email
  }
}
