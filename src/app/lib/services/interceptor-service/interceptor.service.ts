import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  user: {};
  token: any;

  constructor(private authService: NbAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.token = token.getValue();
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable
      }
    });
    
    if (this.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      });
    }

    return next.handle(req)
  }
}
