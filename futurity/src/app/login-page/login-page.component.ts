import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {LoginService} from "../shared/services/login.service";
import {AlertConfiguratorService, AlertType} from "../shared/services/alert-configurator.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  showPassword = false;
  passwordType = "password"; // text or password

  disableLoginButton = false;

  @ViewChild("alert") alert: NgbAlert;
  loginForm: FormGroup;
  loginInfo: string = null;

  constructor(private email: EmailService, private loginService: LoginService, private changeDetector: ChangeDetectorRef,
              private alertConfigurator: AlertConfiguratorService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.email.EMAIL_REGEX)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  togglePasswordView() {
    this.showPassword = !this.showPassword;
    this.passwordType = this.showPassword ? "text" : "password";
  }

  onSubmit() {
    this.disableLoginButton = true;

    this.loginService.login(this.loginForm.value).subscribe({
      next: () => {
        // do something when success
        this.loginInfo = "Success";
        this.resolveAlert(AlertType.SUCCESS, () => this.loginInfo = null);
      },
      error: err => {
        this.loginInfo = err;
        this.resolveAlert(AlertType.ERROR, () => this.loginInfo = null);
      }
    });
  }

  private resolveAlert(alertType: AlertType, whenAlertClosed: () => void) {
    this.changeDetector.detectChanges();
    this.disableLoginButton = false;
    this.alertConfigurator.configure(this.alert, alertType, () => whenAlertClosed());
  }
}
