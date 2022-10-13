import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginStatusService } from '../services/login-status/login-status.service';
import { UserService } from '../services/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private loginStatus: LoginStatusService,
    private router: Router,
    private loginstatusService: LoginStatusService, private readonly userService: UserService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.userService.UserInfo;
      if(currentUser) {
        this.loginstatusService.navigate();
      }
    return true;
  }
}
