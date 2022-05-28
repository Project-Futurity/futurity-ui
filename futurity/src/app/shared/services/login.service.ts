import {Injectable} from '@angular/core';
import {LoginDto, TokenDto} from "../dto/auth-dto";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ErrorHandler} from "./error-handler";
import {catchError, tap} from "rxjs/operators";
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public static readonly TOKEN_KEY = "token";
  private url = environment.apiUrl + "/auth";

  constructor(private http: HttpClient, private errorHandler: ErrorHandler, private jwtHelper: JwtHelperService) {}

  login(user: LoginDto): Observable<any> {
    return this.http.post<TokenDto>(this.url + "/login", user).pipe(
      tap(this.saveToken),
      catchError(this.errorHandler.handle)
    );
  }

  refreshToken(): Observable<any> {
    return this.http.get(this.url + "/refresh-token");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    return !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    return localStorage.getItem(LoginService.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(LoginService.TOKEN_KEY);
  }

  saveToken(token: TokenDto) {
    localStorage.setItem(LoginService.TOKEN_KEY, token.token);
  }
}
