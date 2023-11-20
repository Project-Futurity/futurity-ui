import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DOCUMENT} from "@angular/common";
import {UserInfoDto} from "../shared/dto/user-info-dto";

@Component({
  selector: 'app-telegram-form',
  templateUrl: './telegram-form.component.html',
  styleUrls: ['./telegram-form.component.css']
})
export class TelegramFormComponent implements AfterViewInit {
  userInfo: UserInfoDto;

  constructor(public activeModal: NgbActiveModal, @Inject(DOCUMENT) private document: Document) { }

  ngAfterViewInit() {
    const dialog = this.document.querySelector(".modal-dialog") as any;
    const content = this.document.querySelector(".modal-content") as any;

    dialog.style.width = "350px";
    dialog.style.margin = "auto";

    content.style.borderRadius = "25px";
    content.style.background = "#282c35";
  }

  buildUrl() {
    return "https://t.me/FuturityTestBot?start=" + this.userInfo.id;
  }
}
