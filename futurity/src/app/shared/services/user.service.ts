import { Injectable } from '@angular/core';
import {LoginService} from "./login.service";
import {FileReaderService} from "./file-reader.service";
import {Observable} from "rxjs";
import {FileMetaInfo} from "../interfaces/file-meta-info";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {UserInfoDto} from "../dto/user-info-dto";
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.apiUrl + "/user";

  constructor(private loginService: LoginService, private fileReaderService: FileReaderService,
              private router: Router, private http: HttpClient, private errorHandler: ErrorHandler) {}

  loadAvatar(): Observable<FileMetaInfo> {
    return this.fileReaderService.loadFromUrl(this.url + "/avatar");
  }

  loadInfo(): Observable<UserInfoDto> {
    return this.http.get<UserInfoDto>(this.url).pipe(
      catchError(this.errorHandler.handle)
    )
  }

  logout() {
    this.loginService.logout();
    this.router.navigate([""]);
  }
}
