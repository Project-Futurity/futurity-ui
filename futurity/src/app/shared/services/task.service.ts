import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {Observable} from "rxjs";
import {ChangeTaskIndexDto, ChangeTaskNameDto, CreationTaskDto, DeletingTaskDto} from "../dto/project-dto";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly url = "/project/task/"

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {}

  createTask(request: CreationTaskDto): Observable<number> {
    const url = this.url + request.projectId + "/" + request.columnIndex + "/create";
    let params = new HttpParams();
    params = params.append("taskName", request.taskName);

    return this.http.post<number>(url, params).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  deleteTask(request: DeletingTaskDto): Observable<void> {
    const url = this.url + request.projectId + "/" + request.columnIndex + "/" + request.taskIndex + "/delete";

    return this.http.delete<void>(url).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  changeTaskIndex(projectId: number, request: ChangeTaskIndexDto): Observable<void> {
    const url = this.url + projectId + "/index/change";

    return this.http.patch<void>(url, request).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  changeTaskName(request: ChangeTaskNameDto): Observable<void> {
    const url = this.url + request.projectId + "/" + request.columnIndex + "/" + request.taskIndex + "/name";
    let params = new HttpParams();
    params = params.append("taskName", request.taskName);

    return this.http.patch<void>(url, params).pipe(
        catchError(this.errorHandler.handle)
    );
  }
}
