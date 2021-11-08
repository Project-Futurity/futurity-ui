import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";

@Component({
  selector: 'app-register-user-data-page',
  templateUrl: './register-user-data-page.component.html',
  styleUrls: ['./register-user-data-page.component.css']
})
export class RegisterUserDataPageComponent implements OnInit {
  avatarUrl: string = null;
  avatar: File;
  registerForm: FormGroup;

  showPasswords = false;
  passwordType = "password"; // text or password

  constructor() {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nickname: new FormControl("", [
        Validators.required, Validators.minLength(4)
      ]),
      password: new FormControl("", [
        Validators.required, Validators.minLength(6)
      ]),
      confirmPassword: new FormControl("", [Validators.required])
    }, {validators: this.checkPassword});
  }

  onChangeAvatar(event: any) {
    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      this.avatar = event.target.files[0];
    }
  }

  getAvatar(): string {
    return this.avatarUrl == null ? "assets/user.png" : this.avatarUrl;
  }

  togglePasswordView() {
    this.showPasswords = !this.showPasswords;
    this.passwordType = this.showPasswords ? "text" : "password";
  }

  private checkPassword(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password').value;
    const confirmPassword = form.get('confirmPassword').value;

    return password === confirmPassword ? null : {match: true};
  }
}
