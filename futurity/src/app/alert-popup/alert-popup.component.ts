import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent implements AfterViewInit {
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal, @Inject(DOCUMENT) private document: Document) { }

  ngAfterViewInit() {
    const content = this.document.querySelector(".modal-content") as any;

    content.style.borderRadius = "25px";
    content.style.background = "#282c35";
  }
}
