import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { Params, Router } from '@angular/router';
import { TokenServiceService } from '../token-service/token-service.service';
import { UserObject } from '../../models/user';
import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {

  token: any;
  navigateUrl: string;
  queryParams: Params;

  constructor(private https : HttpClient, private authService: NbAuthService,
    private router: Router, private tokenService: TokenServiceService, private readonly userService: UserService,) { }

  private emitChangeSource = new Subject<any>();

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(data: {}) {
    this.emitChangeSource.next(data);
  }


  checkUserAuthentication(state: any) {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.token = token.getValue();
    });
    if(this.token) {
      let loginDetails = this.tokenService.parseJwt(this.token);
      let user: UserObject = {
        token: this.token,
        userDetails: loginDetails.user_details
      }
      this.userService.token = this.token;
      this.userService.createUserInfo(user, false);
    }
  }

  navigate() {
    let navgateUrl = this.navigateUrl;
    navgateUrl = navgateUrl ? navgateUrl : 'dashboard';
    this.queryParams && Object.keys(this.queryParams).length
    ? this.router.navigate([navgateUrl], {queryParams: this.queryParams, queryParamsHandling: 'merge'})
    : this.router.navigate([navgateUrl]);
    this.navigateUrl = '';
    this.queryParams = {};
  }
}
