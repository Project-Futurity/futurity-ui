import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConfirmationCodeDto, ConfirmationEmailDto} from "../dto/confirmation-dto";
import {catchError} from "rxjs/operators";
import {ErrorHandler} from "./error-handler";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private url = environment.apiUrl + "/auth";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {}

  sendEmailToConfirm(email: string): Observable<unknown> {
    const body: ConfirmationEmailDto = {
      email: email
    };

    return this.http.post(this.url + "/confirm-email", body).pipe(
      catchError(this.errorHandler.handle)
    );
  }

  sendCodeToConfirm(body: ConfirmationCodeDto): Observable<any> {
    return this.http.post(this.url + "/confirm-code", body).pipe(
      catchError(this.errorHandler.handle)
    );
  }
}

