import {Injectable} from "@angular/core";
import {throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {AlertPopupComponent} from "../../alert-popup/alert-popup.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {
  static readonly ERROR_ENDING = " Something bad happened. Please try again later.";

  handle(error: HttpErrorResponse) {
    const defaultMessage = "Something bad happened; please try again later";
    return throwError(error.error.message? error.error.message : defaultMessage);
  }

  static showPopupAlert(error: string, modalService: NgbModal) {
    const modal = modalService.open(AlertPopupComponent, {
      centered: true,
      animation: true,
      scrollable: false
    });
    const component = modal.componentInstance as AlertPopupComponent;
    component.message = error + ErrorHandler.ERROR_ENDING;
  }
}
