import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {EmailService} from "../services/email.service";

@Injectable({
  providedIn: "root"
})
export class RegisterUserDataCanActivateGuard implements CanActivate {

  constructor(private emailService: EmailService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.emailService.hasEmail()) {
      return true
    }

    this.router.navigate(["/singup"]);
    return false;
  }

}
