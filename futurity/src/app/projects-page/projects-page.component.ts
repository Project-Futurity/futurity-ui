import { Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreationProjectFormComponent} from "../creation-project-form/creation-project-form.component";
import {ProjectService} from "../shared/services/project.service";
import {ContextMenuComponent} from "ngx-contextmenu";
import {Project} from "../shared/dto/project-dto";

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent implements OnInit {
  readonly DESCRIBED_TEXT_LENGTH = 17;
  @ViewChild(ContextMenuComponent, {static: true}) basicMenu: ContextMenuComponent;
  projects: Project[] = [];

  constructor(private modalService: NgbModal, private projectService: ProjectService) {}

  ngOnInit() {
     this.projectService.loadProjects().subscribe(projects => {
       this.projects = projects;
     });
  }

  openCreationModal() {
    const modal = this.modalService.open(CreationProjectFormComponent, {
      centered: true,
      animation: true,
      scrollable: false
    });
    const component = modal.componentInstance as CreationProjectFormComponent;
    component.createProjectEvent.subscribe(project => {
      this.projects.push(project);
    });
  }

  deleteProject(project: Project) {
    this.projectService.deleteProject(project.id).subscribe({
      next: () => this.projects = this.projects.filter(p => project.id !== p.id)
    })
  }
}
