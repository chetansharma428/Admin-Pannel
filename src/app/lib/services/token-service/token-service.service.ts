import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {
  JWTToken: string;
  parsedTokenDetails: any;
  expirationSession = null;
  expiryTime: number;
  userTokenExpiration = new EventEmitter();

  constructor(private readonly storageService: StorageService, private http: HttpClient,) { }

  setSilentExpiration(token: string) {
    this.parseJwt(token);
    this.setExpiryTimeFromToken();
    this.stopSilentExpiration();
    this.startSilentExpiration();
  }

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    this.parsedTokenDetails = JSON.parse(jsonPayload);
    return this.parsedTokenDetails;
  }

  tokenExpiration(token: string) {
    this.parseJwt(token);
    this.setExpiryTimeFromToken();
    let isTokenExpired = this.isTokenExpired();
    if (isTokenExpired) {
      this.userTokenExpiration.emit();
    }
    return isTokenExpired;
  }

  isTokenExpired() {
    return new Date().getTime() >= this.expiryTime;
  }

  stopSilentExpiration() {
    clearTimeout(this.expirationSession);
  }

  setExpiryTimeFromToken() {
    this.expiryTime = new Date(this.parsedTokenDetails.exp * 1000).getTime();
  }

  startSilentExpiration() {
    let refreshTime = 60000; //1 min
    let remainingTimeinMilliseconds = this.expiryTime - new Date().getTime() - refreshTime;
    this.expirationSession = setTimeout(() => {
      this.refreshToken();
    }, remainingTimeinMilliseconds);
  }

  refreshToken() {
    this.getExtendedToken().pipe(first())
      .subscribe(
        data => {
          let userState = this.storageService.getUserInfo();
          userState.token = data;
          this.storageService.setUserInfo(userState);
          this.setSilentExpiration(data);
        },
        error => {
          console.log('error', error);
        });
  }

  getExtendedToken() {
    return this.http.post<any>(`${environment.apiUrls.auth}/extend`, '')
      .pipe(map(userInfo => {
        return userInfo.token;
      }));
  }
}
