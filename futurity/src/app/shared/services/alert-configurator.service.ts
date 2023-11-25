import { Injectable } from '@angular/core';
import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";

export enum AlertType {
  WARNING = "warning",
  SUCCESS = "success",
  ERROR = "danger"
}

@Injectable({
  providedIn: 'root'
})
export class AlertConfiguratorService {
  public readonly TIME_TO_CLOSE = 7000;
  private lastTimeout: any;

  constructor() { }

  configure(alert: NgbAlert, type: AlertType, whenClosed: () => void) {
    clearTimeout(this.lastTimeout);

    alert.animation = true;
    alert.dismissible = true;
    alert.type = type;
    alert.closed.subscribe(() => whenClosed());

    this.lastTimeout = setTimeout(() => alert.close(), this.TIME_TO_CLOSE)
  }
}
