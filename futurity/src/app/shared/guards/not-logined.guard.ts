import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class NotLoginedGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.loginService.isAuthenticated()) {
      this.router.navigate(["/projects"]);
      return false;
    }

    return true;
  }
}
