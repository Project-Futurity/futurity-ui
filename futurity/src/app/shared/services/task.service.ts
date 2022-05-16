import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {Observable} from "rxjs";
import {
  ChangeTaskDeadlineDto,
  ChangeTaskIndexDto,
  ChangeTaskNameDto,
  CreationTaskDto,
  DeletingTaskDto
} from "../dto/project-dto";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly url = "/project/task/"

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {}

  createTask(request: CreationTaskDto): Observable<number> {
    const url = this.url + request.projectId + "/" + request.columnId + "/create";

    return this.http.post<number>(url, {name: request.taskName, deadline: request.deadline}).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  deleteTask(request: DeletingTaskDto): Observable<void> {
    const url = this.url + request.projectId + "/" + request.columnId + "/" + request.taskId + "/delete";
    console.log(request)

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
    const url = this.url + request.projectId + "/" + request.columnId + "/" + request.taskId + "/name";

    return this.http.patch<void>(url, {value: request.taskName}).pipe(
        catchError(this.errorHandler.handle)
    );
  }

  changeTaskDeadline(request: ChangeTaskDeadlineDto): Observable<void> {
    const url = this.url + request.projectId + "/" + request.columnId + "/" + request.taskId + "/deadline";

    return this.http.patch<void>(url, {value: request.deadline}).pipe(
      catchError(this.errorHandler.handle)
    );
  }
}
