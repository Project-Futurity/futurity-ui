import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter, Inject,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NgbActiveModal, NgbAlert} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertConfiguratorService, AlertType} from "../shared/services/alert-configurator.service";
import {AvatarService} from "../shared/services/avatar.service";
import {ProjectService} from "../shared/services/project.service";
import {CreationProjectDto} from "../shared/dto/project-dto";
import {Project} from "../shared/interfaces/project-ui";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-creation-project-form',
  templateUrl: './creation-project-form.component.html',
  styleUrls: ['./creation-project-form.component.css']
})
export class CreationProjectFormComponent implements OnInit, AfterViewInit {
  projectForm: FormGroup;
  disableCreationButton = false;
  projectInfo: string = null;
  @ViewChild("alert") alert: NgbAlert;
  @Output() createProjectEvent = new EventEmitter<Project>();

  constructor(public activeModal: NgbActiveModal, private changeDetector: ChangeDetectorRef,
              private alertConfigurator: AlertConfiguratorService, private avatarService: AvatarService,
              private projectService: ProjectService, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required])
    });

    this.avatarService.loadDefaultAvatar("assets/code-project.jpeg");
  }

  ngAfterViewInit() {
    const dialog = this.document.querySelector(".modal-dialog") as any;
    const content = this.document.querySelector(".modal-content") as any;

    dialog.style.width = "450px";
    dialog.style.margin = "auto";

    content.style.borderRadius = "25px";
    content.style.background = "#282c35";
  }

  onSubmit() {
    this.disableCreationButton = true;
    const project: CreationProjectDto = {
      name: this.projectForm.get("name").value,
      description: this.projectForm.get("description").value
    };

    this.projectService.createProject(project, this.avatarService.getAvatar()).subscribe({
      next: id => {
        this.createProjectEvent.emit({
          id: id,
          name: project.name,
          description: project.description,
          previewUrl: this.avatarService.getAvatarUrl()
        });

        this.activeModal.close();
      },
      error: err => {
        this.projectInfo = err;
        this.resolveAlert(AlertType.ERROR, () => this.projectInfo = null);
      }
    })
  }

  onChangeAvatar(event: any) {
    const error: string | void = this.avatarService.loadImage(event.target.files[0]);

    if (error) {
      this.projectInfo = error;
      this.resolveAlert(AlertType.ERROR, () => this.projectInfo = null);
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
