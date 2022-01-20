import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertConfiguratorService, AlertType} from "../shared/services/alert-configurator.service";

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
              private alertConfigurator: AlertConfiguratorService) {
  }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required])
    });
  }

  onSubmit() {
    this.projectInfo = "Something went wrong."
    this.resolveAlert(AlertType.ERROR, () => this.projectInfo = null);
  }

  private resolveAlert(alertType: AlertType, whenAlertClosed: () => void) {
    this.changeDetector.detectChanges();
    this.disableCreationButton = false;
    this.alertConfigurator.configure(this.alert, alertType, () => whenAlertClosed());
  }
}
