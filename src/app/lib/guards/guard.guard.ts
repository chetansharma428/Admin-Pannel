import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginStatusService } from '../services/login-status/login-status.service';
import { TokenServiceService } from '../services/token-service/token-service.service';
import { UserService } from '../services/user-service/user.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private loginstatusService: LoginStatusService, private readonly userService: UserService,
    private router: Router, private tokenService: TokenServiceService, private location: Location) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return true;
  //   const currentUser = this.userService.UserInfo;
  //   if (currentUser && !this.tokenService.tokenExpiration(currentUser.token)) {
  //     // authorised so return true
  //     return true;

  //   }

  //   if (Object.keys(route.queryParams).length && !currentUser) {
  //     this.loginstatusService.navigateUrl = state.url.split("?")[0];
  //     this.loginstatusService.queryParams = route.queryParams;
  //     this.loginstatusService.checkUserAuthentication(state);
  //   }
  //   if (this.location.path() && this.location.path().split("?")[0] === "/dashboard"){
  //     return true;
  //   }

  //   // not logged in so redirect to login page with the return url
  //   this.router.navigate(['/auth']);
  //   return false;

  }

}
