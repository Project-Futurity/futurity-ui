import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AvatarService} from "../shared/services/avatar.service";
import {RegistrationValidator} from "../shared/validators/registration-validator";

@Component({
  selector: 'app-register-user-data-page',
  templateUrl: './register-user-data-form.component.html',
  styleUrls: ['./register-user-data-form.component.css'],
  providers: [AvatarService]
})
export class RegisterUserDataFormComponent implements OnInit {
  registerForm: FormGroup;
  showPasswords = false;
  passwordType = "password"; // text or password
  email: string;

  constructor(private avatarService: AvatarService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nickname: new FormControl("", [
        Validators.required, Validators.minLength(4)
      ]),
      password: new FormControl("", [
        Validators.required, Validators.minLength(6)
      ]),
      confirmPassword: new FormControl("", [
        Validators.required, RegistrationValidator.mustMatch("password")
      ])
    });
  }

  onChangeAvatar(event: any) {
    this.avatarService.loadImage(event.target.files[0]);
  }

  getAvatar(): string {
    return this.avatarService.getAvatar();
  }

  togglePasswordView() {
    this.showPasswords = !this.showPasswords;
    this.passwordType = this.showPasswords ? "text" : "password";
  }
}
