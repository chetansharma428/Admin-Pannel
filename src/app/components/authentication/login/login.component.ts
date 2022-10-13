import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { getDeepFromObject, NbAuthResult, NB_AUTH_OPTIONS } from '@nebular/auth';
import { NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { UserService } from '../../../lib/services/user-service/user.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private readonly service: NbAuthService, @Inject(NB_AUTH_OPTIONS) protected options = {}, private readonly router: Router,
  private readonly userService: UserService, private readonly storageService: StorageService,) { }

  rememberMe: boolean;
  submitted: boolean;
  strategy: string = '';
  user: any = {};
  errors: string[] = [];
  messages: string[] = [];
  showMessages: any = {};
  redirectDelay: number = 0;

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }


  ngOnInit(): void {
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.strategy = this.getConfigValue('forms.login.strategy');
  }

  /**Login into admin application */
  onLogin(form): void {
    const request = { "EmailId": form.value.email, "Password": form.value.password };
    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();        
      } else {
        this.errors = result.getErrors();
      }
    })

    this.userService.isLoggedIn(request);
  }
}
