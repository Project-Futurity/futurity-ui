import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FileReaderService} from "./file-reader.service";
import {CreationProjectDto, IdResponse, ListResponse, Project} from "../dto/project-dto";
import {ProjectUi} from "../interfaces/project-ui";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private url = "/project";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler, private readerService: FileReaderService) {
  }

  loadProjects(): Observable<ProjectUi[]> {
    return this.http.get<ListResponse<Project>>(this.url + "/projects").pipe(
      catchError(this.errorHandler.handle),
      map(projects => this.readProject(projects))
    );
  }

  createProject(request: CreationProjectDto, preview: File): Observable<number> {
    const form = new FormData();

    form.append("preview", preview);
    form.append("project", new Blob(
      [JSON.stringify(request)],
      {type: "application/json"})
    );

    return this.http.post<IdResponse>(this.url + "/create", form).pipe(
      map(response => response.id),
      catchError(this.errorHandler.handle)
    )
  }

  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(this.url + "/delete/" + projectId).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  private readProject(response: ListResponse<Project>): ProjectUi[] {
    return response.values.map(project => {
      const projectUi: ProjectUi = {
        project: project,
        isPreviewLoad: false
      };

      this.readerService.loadFromUrl(this.url + project.previewUrl).subscribe(file => {
        projectUi.project.previewUrl = file.url;
        projectUi.isPreviewLoad = true;
      });

      return projectUi;
    });
  }
}
