import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  ChangeColumnIndexRequest,
  CreationColumnDto,
  IdResponse,
  ListResponse,
  Project,
  ProjectColumn
} from "../dto/project-dto";
import {Observable} from "rxjs";
import {ErrorHandler} from "./error-handler";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private url = "/project/column";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {}

  getColumns(projectId: number): Observable<ProjectColumn[]> {
    const url = this.url + "/" + projectId + "/";

    return this.http.get<ListResponse<ProjectColumn>>(url).pipe(
      catchError(this.errorHandler.handle),
      map(list => list.values)
    );
  }

  createColumn(request: CreationColumnDto): Observable<number> {
    const url = this.url + "/" + request.projectId + "/create";

    return this.http.post<IdResponse>(url, {name: request.name}).pipe(
      catchError(this.errorHandler.handle),
      map(response => response.id)
    );
  }

  changeColumnIndex(request: ChangeColumnIndexRequest) {
    const url = this.url + "/" + request.projectId + "/index/change";

    return this.http.patch(url, {from: request.from, to: request.to}).pipe(
      catchError(this.errorHandler.handle)
    );
  }
}
