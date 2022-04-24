import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreationProjectFormComponent} from "../creation-project-form/creation-project-form.component";
import {ProjectService} from "../shared/services/project.service";
import {ContextMenuComponent} from "ngx-contextmenu";
import {AlertPopupComponent} from "../alert-popup/alert-popup.component";
import {Project, ProjectUi} from "../shared/interfaces/project-ui";
import {Router} from "@angular/router";

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

  constructor(private modalService: NgbModal, private projectService: ProjectService, private router: Router) {
  }

  ngOnInit() {
    this.projectService.loadProjects().subscribe({
      next: projects => {
        this.projectsAreLoad = true;
        this.projects = projects;
      },
      error: () => {
        this.projectsAreLoad = true;
        this.showPopupAlert("Can't load the projects. Something bad happened. Please try again later")
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
    this.projectService.deleteProject(project.project.id).subscribe({
      next: () => this.projects = this.projects.filter(p => project.project.id !== p.project.id),
      error: () => this.showPopupAlert("Can't delete the project. Something bad happened. Please try again later")
    });
  }

  navigateToProject(project: Project) {
    this.router.navigate(["projects/board", project.id]);
  }

  private showPopupAlert(error: string) {
    const modal = this.modalService.open(AlertPopupComponent, {
      centered: true,
      animation: true,
      scrollable: false
    });
    const component = modal.componentInstance as AlertPopupComponent;
    component.message = error;
  }
}
