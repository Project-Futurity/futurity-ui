import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";
import {AlertConfiguratorService, AlertType} from "../shared/services/alert-configurator.service";
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";

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
              private changeDetector: ChangeDetectorRef) {}

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
    setTimeout(() => {
      this.emailInfo = "We have sent you a repeated message";
      this.changeDetector.detectChanges();
      this.showSendAgainTip = false;

      this.alertConfigurator.configure(this.alert, AlertType.SUCCESS, () => {
        this.emailInfo = null;
        this.showSendAgainTip = true;
      });
    }, 2000);
  }

  onSubmit() {
    if (!this.isEmailSend) {
      this.disableContinueButton = true;

      setTimeout(() => {
        this.emailInfo = "We have sent you a confirmation email with code";
        this.changeDetector.detectChanges();
        this.disableContinueButton = false;
        this.isEmailSend = true;

        setTimeout(() => this.showSendAgainTip = true, this.alertConfigurator.TIME_TO_CLOSE);

        this.alertConfigurator.configure(this.alert, AlertType.SUCCESS, () => {
          this.emailInfo = null;
        });
      }, 2000);
    } else {
      this.closeEvent.emit(this.emailInputForm.value.email);
    }
  }
}
