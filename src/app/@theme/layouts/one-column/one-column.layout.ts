import { LoginStatusService } from './../../../lib/services/login-status/login-status.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from '../../../lib/services/user-service/user.service';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf="isAuthenticated">
        <ngx-header class="w-100"></ngx-header>
      </nb-layout-header>

      <nb-layout-column class="p-0">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed *ngIf="isAuthenticated">
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
      
      
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit, OnDestroy {

  public isAuthenticated: boolean = false;
  private destroyed = new Subject<Boolean>();

  constructor(private readonly userService: UserService,
    private readonly router: Router,
    private readonly loginStatusService: LoginStatusService) {

    this.loginStatusService.changeEmitted$.subscribe((res) => {
      this.isAuthenticated = res.authentication;
    })
  }

  ngOnInit() {
    this.userService.isAuthenticated$.subscribe((res: boolean) => {
      if (res) {
        this.isAuthenticated = res;
        // this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/auth']);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

}
