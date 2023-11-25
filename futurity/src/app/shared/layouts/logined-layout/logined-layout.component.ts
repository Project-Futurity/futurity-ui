import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TelegramFormComponent} from "../../../telegram-form/telegram-form.component";
import {ConfigureTaskFormComponent} from "../../../configure-task-form/configure-task-form.component";

@Component({
  selector: 'app-logined-layout',
  templateUrl: './logined-layout.component.html',
  styleUrls: ['./logined-layout.component.css']
})
export class LoginedLayoutComponent implements OnInit {
  avatar: string;
  avatarIsLoad = false;
  isUserInfoLoading = false;

  constructor(private userService: UserService, private modalService: NgbModal) {
  }

  openCreationModal() {
    this.isUserInfoLoading = true;

    this.userService.loadInfo().subscribe(userInfo => {
      this.isUserInfoLoading = false;

      const modal = this.modalService.open(TelegramFormComponent, {
        centered: true,
        animation: true,
        scrollable: false
      })

      const component = modal.componentInstance as TelegramFormComponent;
      component.userInfo = userInfo
    });
  }

  ngOnInit(): void {
    this.userService.loadAvatar().subscribe(file => {
      this.avatar = file.url;
      this.avatarIsLoad = true;
    });
  }

  logout() {
    this.userService.logout();
  }
}
