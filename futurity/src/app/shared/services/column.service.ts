import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {
  ChangeColumnIndexRequest,
  CreationColumnDto, DeletingColumnDto,
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

    return this.http.get<ProjectColumn[]>(url).pipe(
      catchError(this.errorHandler.handle),
    );
  }

  createColumn(request: CreationColumnDto): Observable<number> {
    const url = this.url + "/" + request.projectId + "/create";
    let params = new HttpParams();
    params = params.append('columnName', request.name);

    return this.http.post<number>(url, params).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  deleteColumn(request: DeletingColumnDto): Observable<void> {
    const url = this.url + "/" + request.projectId + "/delete/" + request.index;

    return this.http.delete<void>(url).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  changeColumnIndex(request: ChangeColumnIndexRequest): Observable<void> {
    const url = this.url + "/" + request.projectId + "/index/change";
    let params = new HttpParams();
    params = params.append('from', request.from);
    params = params.append('to', request.to);

    return this.http.patch<void>(url, params).pipe(
      catchError(this.errorHandler.handle)
    );
  }
}
