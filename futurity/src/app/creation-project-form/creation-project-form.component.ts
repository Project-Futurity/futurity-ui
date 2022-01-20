import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertConfiguratorService, AlertType} from "../shared/services/alert-configurator.service";
import {AvatarService} from "../shared/services/avatar.service";

@Component({
  selector: 'app-creation-project-form',
  templateUrl: './creation-project-form.component.html',
  styleUrls: ['./creation-project-form.component.css']
})
export class CreationProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  disableCreationButton = false;
  projectInfo: string = null;
  @ViewChild("alert") alert: NgbAlert;

  constructor(public activeModal: NgbActiveModal, private changeDetector: ChangeDetectorRef,
              private alertConfigurator: AlertConfiguratorService, private avatarService: AvatarService) {
  }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required])
    });

    this.avatarService.loadDefaultAvatar("assets/code-project.jpeg");
  }

  onSubmit() {
    this.projectInfo = "Something went wrong."
    this.resolveAlert(AlertType.ERROR, () => this.projectInfo = null);
  }

  onChangeAvatar(event: any) {
    const error: string | void = this.avatarService.loadImage(event.target.files[0]);

    if (error) {
      this.projectInfo = error;
      this.resolveAlert(AlertType.ERROR,() => this.projectInfo = null);
    }
  }

  getAvatar(): string {
    return this.avatarService.getAvatarUrl();
  }

  private resolveAlert(alertType: AlertType, whenAlertClosed: () => void) {
    this.changeDetector.detectChanges();
    this.disableCreationButton = false;
    this.alertConfigurator.configure(this.alert, alertType, () => whenAlertClosed());
  }
}
