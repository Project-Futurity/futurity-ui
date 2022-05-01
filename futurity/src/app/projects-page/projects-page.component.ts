import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CreationProjectFormComponent} from "../creation-project-form/creation-project-form.component";
import {ProjectService} from "../shared/services/project.service";
import {ContextMenuComponent} from "ngx-contextmenu";
import {Project, ProjectUi} from "../shared/interfaces/project-ui";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ErrorHandler} from "../shared/services/error-handler";

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit {
  readonly DESCRIBED_TEXT_LENGTH = 17;
  projectsAreLoad = false;
  @ViewChild(ContextMenuComponent, {static: true}) basicMenu: ContextMenuComponent;
  projects: ProjectUi[] = [];

  changingProjectName = false;
  changingProjectNameIndex = -1;
  @ViewChild("input_project_name_change") changingProjectNameInput: ElementRef;

  changingProjectDescription = false;
  changingProjectDescriptionIndex = -1;
  @ViewChild("input_project_description_change") changingProjectDescriptionInput: ElementRef;

  constructor(private modalService: NgbModal, private projectService: ProjectService, private router: Router,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.projectService.loadProjects().subscribe({
      next: projects => {
        this.projectsAreLoad = true;
        this.projects = projects;
      },
      error: () => {
        this.projectsAreLoad = true;
        ErrorHandler.showPopupAlert("Can't load the projects.", this.modalService)
      }
    });
  }

  openCreationModal() {
    const modal = this.modalService.open(CreationProjectFormComponent, {
      centered: true,
      animation: true,
      scrollable: false
    });
    const component = modal.componentInstance as CreationProjectFormComponent;

    component.createProjectEvent.subscribe(project => this.projects.push({
      project: project,
      isPreviewLoad: true
    }));
  }

  deleteProject(project: ProjectUi) {
    const index = this.projects.indexOf(project);
    this.projects.splice(index, 1);

    this.projectService.deleteProject(project.project.id).subscribe({
      error: () => {
        this.projects.splice(index, 0, project);
        ErrorHandler.showPopupAlert("Can't delete the project.", this.modalService)
      }
    });
  }

  navigateToProject(project: Project) {
    if (!this.changingProjectName && !this.changingProjectDescription) {
      this.router.navigate(["projects/board", project.id]);
    }
  }

  startChangingProjectName(project: ProjectUi) {
    this.changingProjectName = true;
    this.changingProjectNameIndex = this.projects.indexOf(project);
    this.changeDetector.detectChanges();
    this.changingProjectNameInput.nativeElement.focus();
  }

  abortChangingProjectName() {
    this.changingProjectName = false;
    this.changingProjectNameIndex = -1;
  }

  changeProjectName(event: any, projectIndex: number) {
    const name = event.target.value as string;

    if (name && this.changingProjectName) {
      const previousName = this.projects[projectIndex].project.name;

      if (name != previousName) {
        this.projects[projectIndex].project.name = name;

        this.projectService.changeProjectName(projectIndex, name).subscribe({
          error: () => {
            this.projects[projectIndex].project.name = previousName;
            ErrorHandler.showPopupAlert("Can't rename the project.", this.modalService)
          }
        });
      }
    }

    this.abortChangingProjectName();
  }

  startChangingProjectDescription(project: ProjectUi) {
    this.changingProjectDescriptionIndex = this.projects.indexOf(project);
    this.changingProjectDescription = true;
    this.changeDetector.detectChanges();
    this.changingProjectDescriptionInput.nativeElement.focus();
  }

  abortChangingProjectDescription() {
    this.changingProjectDescriptionIndex = -1;
    this.changingProjectDescription = false;
  }

  changeProjectDescription(event: any, projectIndex: number) {
    const description = event.target.value as string;

    if (description && this.changingProjectDescription) {
      const previousDescription = this.projects[projectIndex].project.description;

      if (description != previousDescription) {
        this.projects[projectIndex].project.description = description;

        this.projectService.changeProjectDescription(projectIndex, previousDescription).subscribe({
          error: () => {
            this.projects[projectIndex].project.description = previousDescription;
            ErrorHandler.showPopupAlert("Can't change description the project.", this.modalService)
          }
        });
      }
    }

    this.abortChangingProjectDescription();
  }
}
