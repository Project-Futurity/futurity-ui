import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AvatarService} from "../shared/services/avatar.service";

@Component({
  selector: 'app-register-user-data-page',
  templateUrl: './register-user-data-page.component.html',
  styleUrls: ['./register-user-data-page.component.css'],
  providers: [AvatarService]
})
export class RegisterUserDataPageComponent implements OnInit {
  registerForm: FormGroup;
  showPasswords = false;
  passwordType = "password"; // text or password

  constructor(private avatarService: AvatarService) {}

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
    this.avatarService.loadImage(event.target.files[0]);
  }

  getAvatar(): string {
    return this.avatarService.getAvatar();
  }

  togglePasswordView() {
    this.showPasswords = !this.showPasswords;
    this.passwordType = this.showPasswords ? "text" : "password";
  }

  private checkPassword(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password').value;
    const confirmPassword = form.get('confirmPassword').value;

    return password === confirmPassword ? null : {notMatch: true};
  }
}
