import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild,} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";
import {AlertConfiguratorService, AlertType} from "../shared/services/alert-configurator.service";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmationService} from "../shared/services/confirmation.service";

@Component({
  selector: 'app-register-email-page',
  templateUrl: './register-email-form.component.html',
  styleUrls: ['./register-email-form.component.css']
})
export class RegisterEmailFormComponent implements OnInit {
  emailInputForm: FormGroup;
  disableContinueButton = false;
  @Output() closeEvent = new EventEmitter<string>();

  @ViewChild("alert") alert: NgbAlert;
  emailInfo: string = null;
  isEmailSend = false;
  showSendAgainTip = false;

  constructor(private emailService: EmailService, private alertConfigurator: AlertConfiguratorService,
              private changeDetector: ChangeDetectorRef, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.emailInputForm = new FormGroup({
      email: new FormControl(this.emailService.getEmail(), [
        Validators.required,
        Validators.pattern(this.emailService.EMAIL_REGEX)
      ]),
      code: new FormControl("", [
        Validators.required, Validators.pattern("\\d{6}")
      ])
    });
  }

  isFormInvalid(): boolean {
    return this.isEmailSend ? this.emailInputForm.invalid : this.emailInputForm.get('email').invalid;
  }

  sendAgain() {
    this.showSendAgainTip = false;

    this.sendEmailMessage("We have sent you a repeated message",
      () => {
        this.emailInfo = null;
        this.showSendAgainTip = true;
      });
  }

  onSubmit() {
    this.disableContinueButton = true;

    if (!this.isEmailSend) {
      this.sendEmailMessage("We have sent you a confirmation email with code",
        () => this.emailInfo = null);
    } else {
      this.confirmationService.sendCodeToConfirm(this.emailInputForm.value).subscribe({
        next: () => {
          this.closeEvent.emit(this.emailInputForm.value.email);
        },
        error: (err) => {
          this.emailInfo = err;
          this.resolveAlert(AlertType.ERROR, () => this.emailInfo = null);
        }
      })
    }
  }

  private sendEmailMessage(successMessage: string, whenAlertClosed: () => void): void {
    this.confirmationService.sendEmailToConfirm(this.emailInputForm.value.email).subscribe({
      next: () => {
        this.isEmailSend = true;
        this.emailInfo = successMessage;
        setTimeout(() => this.showSendAgainTip = true, this.alertConfigurator.TIME_TO_CLOSE);
        this.resolveAlert(AlertType.SUCCESS, whenAlertClosed);
      },
      error: err => {
        this.emailInfo = err;
        this.resolveAlert(AlertType.ERROR, whenAlertClosed);
      },
    });
  }

  private resolveAlert(alertType: AlertType, whenAlertClosed: () => void) {
    this.changeDetector.detectChanges();
    this.disableContinueButton = false;
    this.alertConfigurator.configure(this.alert, alertType, () => whenAlertClosed());
  }
}
