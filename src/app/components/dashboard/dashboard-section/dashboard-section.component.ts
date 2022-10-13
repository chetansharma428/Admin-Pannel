import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { WalletServiceService } from '../../../lib/services/corporate-service/wallet/wallet-service.service';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { UserService } from '../../../lib/services/user-service/user.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-dashboard-section',
  templateUrl: './dashboard-section.component.html',
  styleUrls: ['./dashboard-section.component.scss']
})
export class DashboardSectionComponent implements OnInit {

  userInfo: any;
  branch: any;
  corporateAdminAllDetail: any;
  corporateAdminWalletPermission: any;

  loading: boolean = false;

  constructor(private readonly userService: UserService, private readonly router: Router,
    private readonly storageService: StorageService, private readonly dialog: NbDialogService,
    private readonly branchStatusService: BranchSavingService, private readonly walletService: WalletServiceService,) {
    if (this.userService.UserInfo) {
      this.userInfo = this.userService.UserInfo;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.dashboardLending();
    this.branchStatusService.watchBranchSubject().subscribe((res) => {
      this.branch = res;
    })

    if (this.userInfo?.userType.toLowerCase() === 'corporateadmin') {
      this.walletService.walletParticularCorporate(this.userInfo.agencyId, this.userInfo.corporateId).subscribe((res) => {
        this.corporateAdminAllDetail = res;
        this.loading = false;
      })
      let profileDetails = this.storageService.getItems('profileDetail');
      this.corporateAdminWalletPermission = profileDetails[0]?.permissionsList.filter((list) => list === 'corporate-read-wallet');
    }
    this.loading = false;
  }

  dashboardLending() {
    this.userService.updateUserInfo.subscribe((res) => {
      this.userInfo = res;
    })
  }

  walletPageNaviagtion() {
    if (this.userInfo.userType.toLowerCase() === 'corporateadmin' && this.corporateAdminWalletPermission.length > 0) {
      if (this.corporateAdminAllDetail.walletId) {
        this.router.navigate([`${this.corporateAdminAllDetail.parentId}/corporate/${this.corporateAdminAllDetail.parentId}/corporateId/${this.userInfo.corporateId}/walletId/${this.corporateAdminAllDetail.walletId}`]);
      } else {
        this.showDailog('Wallet Message', 'Wallet permission does not exist for this corporate');
      }
    } else {
      this.showDailog('Wallet Message', 'Wallet permission does not exist for this corporate');
    }
  }

  manageCorporate() {
    this.router.navigate([`${this.userInfo.agencyId}/corporate/list`]);
  }

  ViewCorporate() {
    this.router.navigate([`${this.userInfo?.agencyId}/corporate/${this.userInfo?.corporateId}/profile`], { queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge' });
  }

  userProfileNavigation() {
    this.router.navigate([`agencies/${this.userInfo.agencyId}/user-profile`]);
  }

  viewGroups() {
    this.router.navigate([`${this.userInfo.agencyId}/corporate/${this.userInfo.corporateId}/groups`]);
  }

  viewBookings() {
    this.router.navigate([`booking`])
  }

  employeesManage() {
    this.router.navigate([`${this.userInfo.agencyId}/corporate/${this.userInfo.corporateId}/employee-profile`]);
  }

  policiesManage() {
    this.router.navigate([`${this.userInfo.agencyId}/corporate/${this.userInfo.corporateId}/policy`]);
  }

  agencyStaffRouting() {
    this.router.navigate([`agency/${this.userInfo.agencyId}/staff/list`]);
  }

  branchRouting() {
    this.router.navigate([`${this.userInfo.agencyId}/branch/list`]);
  }

  showDailog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    });
  }

}
