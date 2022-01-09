import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {RegistrationDto} from "../dto/auth-dto";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private url = "/auth";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler) {
  }

  register(user: RegistrationDto, avatar: File): Observable<any> {
    const form = new FormData();

    form.append("avatar", avatar);
    form.append("user", new Blob(
      [JSON.stringify(user)],
      {type: "application/json"})
    );

    return this.http.post(this.url + "/singup", form).pipe(
      catchError(this.errorHandler.handle)
    );
  }
}
