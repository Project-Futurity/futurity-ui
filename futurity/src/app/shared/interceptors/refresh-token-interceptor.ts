import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";
import {LoginService} from "../services/login.service";
import {TokenDto} from "../dto/auth-dto";

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {

        if (err.status === 401) {
          return this.handleUnauthorizedError(req, next);
        }

        return throwError(err);
      })
    );
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler) {
    return this.loginService.refreshToken().pipe(
      switchMap((token: TokenDto) => {
        this.loginService.saveToken(token);

        return next.handle(this.addTokenToHeader(request, token.token));
      }),
      // TODO: make handling refresh token expiring
    );
  }

  private addTokenToHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
