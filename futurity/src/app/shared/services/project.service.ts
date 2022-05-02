import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FileReaderService} from "./file-reader.service";
import {CreationProjectDto} from "../dto/project-dto";
import {Project, ProjectUi} from "../interfaces/project-ui";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private url = "/project";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler, private readerService: FileReaderService) {
  }

  loadProjects(): Observable<ProjectUi[]> {
    return this.http.get<Project[]>(this.url + "/projects").pipe(
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

    return this.http.post<number>(this.url + "/create", form).pipe(
      catchError(this.errorHandler.handle)
    )
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(this.url + "/delete/" + projectId).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  changeProjectName(projectId: number, projectName: string): Observable<void> {
    const url = this.url + "/" + projectId + "/name";

    return this.http.patch<void>(url, {value: projectName}).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  changeProjectDescription(projectId: number, projectDescription: string): Observable<void> {
    const url = this.url + "/" + projectId + "/description";

    return this.http.patch<void>(url, {value: projectDescription}).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  private readProject(response: Project[]): ProjectUi[] {
    return response.map(project => {
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
