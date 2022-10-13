import { Component, OnInit } from '@angular/core';
import { UserService } from '../../lib/services/user-service/user.service';

@Component({
  selector: 'ngx-pages',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {

  userInfo: any;

  constructor(private readonly userService: UserService) {
    if (this.userService.UserInfo) {
      this.userInfo = this.userService.UserInfo;
    }

  }

  ngOnInit() {
    this.dashboardLending();
  }

  dashboardLending() {
    this.userService.updateUserInfo.subscribe((res) => {
      this.userInfo = res;
    })
  }
}
