import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {Observable} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {FileReaderService} from "./file-reader.service";
import {CreationProjectDto, CreationProjectResponseDto, Project, ProjectResponseDto} from "../dto/project-dto";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = null;
  private url = "/project";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler, private readerService: FileReaderService) {
  }

  loadProjects(): Observable<Project[]> {
    if (this.projects) {
      return new Observable(subscriber => {
        subscriber.next(this.projects);
        subscriber.complete();
      })
    } else {
      return this.http.get<ProjectResponseDto>(this.url + "/projects").pipe(
        catchError(this.errorHandler.handle),
        map(projects => this.readProject(projects)),
        tap(proj => this.projects = proj)
      );
    }
  }

  createProject(request: CreationProjectDto, preview: File): Observable<number> {
    const form = new FormData();

    form.append("preview", preview);
    form.append("project", new Blob(
      [JSON.stringify(request)],
      {type: "application/json"})
    );

    return this.http.post<CreationProjectResponseDto>(this.url + "/create", form).pipe(
      map(response => response.projectId),
      catchError(this.errorHandler.handle)
    )
  }

  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(this.url + "/delete/" + projectId).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  logout() {
    this.projects = null;
  }

  private readProject(response: ProjectResponseDto): Project[] {
    const projects = response.projects;
    projects.forEach(project => {
      this.readerService.loadFromUrl(this.url + project.previewUrl).subscribe(file => {
        project.previewUrl = file.url;
      })
    });

    return projects;
  }
}
