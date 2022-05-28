import { Injectable } from '@angular/core';
import {LoginService} from "./login.service";
import {FileReaderService} from "./file-reader.service";
import {Observable} from "rxjs";
import {FileMetaInfo} from "../interfaces/file-meta-info";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.apiUrl + "/user";

  constructor(private loginService: LoginService, private fileReaderService: FileReaderService,
              private router: Router) {}

  loadAvatar(): Observable<FileMetaInfo> {
    return this.fileReaderService.loadFromUrl(this.url + "/avatar");
  }

  logout() {
    this.loginService.logout();
    this.router.navigate([""]);
  }
}
