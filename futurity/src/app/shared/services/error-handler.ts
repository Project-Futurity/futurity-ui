import {Injectable} from "@angular/core";
import {throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {
  handle(error: HttpErrorResponse) {
    const defaultMessage = "Something bad happened; please try again later";
    return throwError(error.error.message? error.error.message : defaultMessage);
  }
}
