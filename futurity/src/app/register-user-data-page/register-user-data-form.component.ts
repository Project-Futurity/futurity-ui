import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AvatarService} from "../shared/services/avatar.service";
import {RegistrationValidator} from "../shared/validators/registration-validator";
import {RegistrationService} from "../shared/services/registration.service";
import {RegistrationDto} from "../shared/dto/auth-dto";
import {AlertConfiguratorService, AlertType} from "../shared/services/alert-configurator.service";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-user-data-page',
  templateUrl: './register-user-data-form.component.html',
  styleUrls: ['./register-user-data-form.component.css'],
  providers: [AvatarService]
})
export class RegisterUserDataFormComponent implements OnInit {
  registerForm: FormGroup;
  disableRegisterButton = false;
  showPasswords = false;

  @ViewChild("alert") alert: NgbAlert;
  registrationInfo: string = null;
  passwordType = "password"; // text or password
  email: string;

  constructor(private avatarService: AvatarService, private registrationService: RegistrationService,
              private alertConfigurator: AlertConfiguratorService,  private changeDetector: ChangeDetectorRef,
              private router: Router) {}

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

    this.avatarService.loadDefaultAvatar("/assets/user.png");
  }

  onChangeAvatar(event: any) {
    const error: string | void = this.avatarService.loadImage(event.target.files[0]);

    if (error) {
      this.registrationInfo = error;
      this.resolveAlert(AlertType.ERROR,() => this.registrationInfo = null);
    }
  }

  getAvatar(): string {
    return this.avatarService.getAvatarUrl();
  }

  onSubmit() {
    const user: RegistrationDto = {
      email: this.email,
      nickname: this.registerForm.get("nickname").value,
      password: this.registerForm.get("password").value
    };

    this.registrationService.register(user, this.avatarService.getAvatar()).subscribe({
      next: () => {
        this.router.navigate(["/login"]);
      },
      error: err => {
        this.registrationInfo = err;
        this.resolveAlert(AlertType.ERROR, () => this.registrationInfo = null);
      }
    })
  }

  togglePasswordView() {
    this.showPasswords = !this.showPasswords;
    this.passwordType = this.showPasswords ? "text" : "password";
  }

  private resolveAlert(alertType: AlertType, whenAlertClosed: () => void) {
    this.changeDetector.detectChanges();
    this.disableRegisterButton = false;
    this.alertConfigurator.configure(this.alert, alertType, () => whenAlertClosed());
  }
}
