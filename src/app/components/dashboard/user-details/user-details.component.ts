import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { UserService } from '../../../lib/services/user-service/user.service';

@Component({
  selector: 'ngx-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userInfo: any;

  constructor(private readonly userService: UserService, private storageService: StorageService) {
    if(this.userService?.UserInfo) {
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
