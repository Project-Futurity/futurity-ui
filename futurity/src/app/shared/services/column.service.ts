import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {
  ChangeColumnIndexDto, ChangeColumnNameDto,
  CreationColumnDto, DeletingColumnDto,
} from "../dto/project-dto";
import {Observable} from "rxjs";
import {ErrorHandler} from "./error-handler";
import {catchError} from "rxjs/operators";
import {ProjectColumn} from "../interfaces/project-ui";

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private readonly url = "/project/column/";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {}

  getColumns(projectId: number): Observable<ProjectColumn[]> {
    const url = this.url + projectId + "/";

    return this.http.get<ProjectColumn[]>(url).pipe(
      catchError(this.errorHandler.handle),
    );
  }

  createColumn(request: CreationColumnDto): Observable<number> {
    const url = this.url + request.projectId + "/create";

    return this.http.post<number>(url, {value: request.name}).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  deleteColumn(request: DeletingColumnDto): Observable<void> {
    const url = this.url + request.projectId + "/" + request.columnId + "/delete/";

    return this.http.delete<void>(url).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  changeColumnIndex(request: ChangeColumnIndexDto): Observable<void> {
    const url = this.url + request.projectId + "/index/change";
    let params = new HttpParams();
    params = params.append("from", request.from);
    params = params.append("to", request.to);

    return this.http.patch<void>(url, params).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  changeColumnName(request: ChangeColumnNameDto): Observable<void> {
    const url = this.url + request.projectId + "/" + request.columnId + "/name";

    return this.http.patch<void>(url, {value: request.columnName}).pipe(
      catchError(this.errorHandler.handle)
    );
  }
}
