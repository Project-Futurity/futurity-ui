import { Component } from '@angular/core';
import {Project} from "../shared/interfaces/project";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreationProjectFormComponent} from "../creation-project-form/creation-project-form.component";

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent {
  readonly DESCRIBED_TEXT_LENGTH = 17;
  projects: Project[] = [
    {title: "Spring learning", imageUrl: "assets/code-project.jpeg", description: "Description"},
  ];

  constructor(private modalService: NgbModal) {}

  openCreationModal() {
    this.modalService.open(CreationProjectFormComponent, {
      centered: true,
      animation: true,
      scrollable: false
    });
  }
}
