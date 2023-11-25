import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {RegistrationDto} from "../dto/auth-dto";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private url = environment.apiUrl + "/auth";

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
