import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-logined-layout',
  templateUrl: './logined-layout.component.html',
  styleUrls: ['./logined-layout.component.css']
})
export class LoginedLayoutComponent implements OnInit {
  avatar: string;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.loadAvatar().subscribe(file => this.avatar = file.url);
  }

  logout() {
    this.userService.logout();
  }
}
