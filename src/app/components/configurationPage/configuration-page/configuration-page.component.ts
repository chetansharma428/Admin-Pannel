import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { UserService } from '../../../lib/services/user-service/user.service';

@Component({
  selector: 'ngx-configuration-page',
  templateUrl: './configuration-page.component.html',
  styleUrls: ['./configuration-page.component.scss']
})
export class ConfigurationPageComponent implements OnInit {

  userInfo: any;
  branch:any;
  corporateAdminAllDetail: any;
  corporateAdminWalletPermission: any;

  loading: boolean = false;

  constructor(private readonly router: Router, private readonly userService: UserService,
    private readonly branchStatusService: BranchSavingService, private readonly storageService: StorageService,
    private readonly activatedRoute: ActivatedRoute,) {
    if(this.userService.UserInfo) {
      this.userInfo = this.userService.UserInfo;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.dashboardLending();
    const paramMaps = this.activatedRoute.snapshot.params;
    // console.log(paramMaps);
    this.branchStatusService.watchBranchSubject().subscribe((res) => {
      this.branch = res;
    })
      let profileDetails = this.storageService.getItems('profileDetail');
      this.corporateAdminWalletPermission = profileDetails[0]?.permissionsList.filter((list) => list === 'corporate-read-wallet');
    this.loading = false;
  }

  dashboardLending() {
    this.userService.updateUserInfo.subscribe((res) => {
      this.userInfo = res;
    })
  }

  channelNavigation() {
    const paramMaps = this.activatedRoute.snapshot.params;
    this.router.navigate([`${paramMaps.id}/channels`])
  }

  providerNavigation() {
    const paramMaps = this.activatedRoute.snapshot.params;
    this.router.navigate([`${paramMaps.id}/providers`])
  }

  corporateCodeNavigation() {
    const paramMaps = this.activatedRoute.snapshot.params;
    this.router.navigate([`${paramMaps.id}/corporate-code`])
  }

  passthroughtNavigation() {
    const paramMaps = this.activatedRoute.snapshot.params;
    this.router.navigate([`${paramMaps.id}/passThrough`])
  }

  revenueNavigation() {
    const paramMaps = this.activatedRoute.snapshot.params;
    this.router.navigate([`${paramMaps.id}/revenue`])
  }

}
