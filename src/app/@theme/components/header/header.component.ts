import { LoginStatusService } from './../../../lib/services/login-status/login-status.service';
import { TokenServiceService } from './../../../lib/services/token-service/token-service.service';
import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { UserService } from '../../../lib/services/user-service/user.service';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnChanges, OnInit {

  userPictureOnly: boolean = false;
  showBranchesPanel: boolean = false;
  userMenu = [{ title: 'My Profile' }, { title: 'Log out' }];
  showSubmenu: any[] = [];
  showInfo: any[] = [];
  mainMenu = [
    { 'title': 'Dashboard', 'routeName': 'dashboard', 'route': '/dashboard' },
    {
      'title': 'Agency', 'route': '', 'submenus': [
        { 'title': 'Agency', 'routeName': 'profile', 'route': '/agency' },
        { 'title': 'User Profile', 'routeName': 'userProfile', 'route': 'agencies/:id/user-profile' },
      ]
    },
    {
      'title': 'Corporate', 'route': '', 'submenus': [
        { 'title': 'Corporate', 'routeName': '', 'route': ':id/corporate' },
        { 'title': 'Employee', 'routeName': 'employee', 'route': ':id/corporate/:corpId/employee' },
        { 'title': 'Employees Profile', 'routeName': 'employee-profile', 'route': ':id/corporate/:corpId/employee-profile' },
        { 'title': 'Groups', 'routeName': 'groups', 'route': ':id/corporate/:corpId/groups' },
        { 'title': 'Policy', 'routeName': 'policy', 'route': ':id/corporate:corpId/policy' },
      ]
    },
    {
      'title': 'Branch', 'route': '', 'submenus': [
        { 'title': 'Branches', 'routname': 'branch', 'route': 'branch/:id' }
      ]
    },
  ]
  branches: any[] = [];
  currentUser: any;
  loggedInUserDetails: any;
  selectedItem: any;

  agencyDisplay: boolean;
  corporateDisplay: boolean;
  branchDisplay: boolean;
  configurationDisplay: boolean;
  bookingDisplay: boolean;

  public constructor(private readonly storageService: StorageService, private readonly router: Router,
    private nbMenuService: NbMenuService, private readonly userService: UserService, private readonly tokenService: TokenServiceService, private loginService: LoginStatusService, private branchSavingService: BranchSavingService) {
    if (this.userService.UserInfo) {
      this.currentUser = this.userService.UserInfo;
      if (!this.storageService.getItems('branchDetail')) {
        this.selectedItem = this.getBranchNameFromMap();
      } else {
        this.selectedItem = this.storageService.getItems('branchDetail')?.id;
      }
    }
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (this.userService.UserInfo) {
      this.currentUser = this.userService.UserInfo;
    }
  }

  ngOnInit() {
    this.branches = this.storageService.getItems('agencyBranchesDetails')?.items;
    this.loggedInUserDetails = this.storageService.getItems('loggedinUserdetails')?.userDetails;
    this.updateUserSubscription();
  }

  navigateHome(route) {
    this.router.navigate([route]);
    this.agencyDisplay = false;
    this.corporateDisplay = false;
    this.branchDisplay = false;
    return false;
  };

  changeBranch($event) {
    this.selectedItem = $event;
    let userState = this.storageService.getUserInfo();
    userState.selectedBranch = $event;
    this.storageService.setUserInfo(userState);
    this.storageService.setBranchDetail($event);
    this.branchSavingService.setBranchSubject(this.selectedItem);
    this.agencyDisplay = false;
    this.corporateDisplay = false;
  }

  navBarHandling(name) {
    this.agencyDisplay = false;
    this.corporateDisplay = false;
    this.branchDisplay = false;
    this.configurationDisplay = false
    this.bookingDisplay = false;

    if (this.currentUser?.userType == 'agencyAdmin' || this.currentUser?.userType == 'agencyemployee') {
      if (this.agencyDisplay || this.corporateDisplay || this.branchDisplay || this.configurationDisplay) {
        this.agencyDisplay = false;
        this.corporateDisplay = false;
        this.branchDisplay = false;
        this.configurationDisplay = false;
      } else {
        if (name === 'agencyMain') {
          this.agencyDisplay = true;
        } else if (name === 'corporateMain') {
          this.corporateDisplay = true;
        } else if (name === 'branch') {
          this.branchDisplay = true;
        } else if (name === 'booking') {
          this.bookingDisplay = true;
        }
      }
    } else {
      if (this.agencyDisplay || this.corporateDisplay) {
        this.agencyDisplay = false;
        this.corporateDisplay = false;
      } else {
        if (name === 'agencyMain') {
          this.agencyDisplay = true;
        } else if (name === 'corporateMain') {
          this.corporateDisplay = true;
        }
      }

    }
  };

  navigateToRoute(route, routename) {
    const id = this.loggedInUserDetails?.AgencyId ? this.loggedInUserDetails?.AgencyId : this.loggedInUserDetails?.ParentId;
    const corpId = this.loggedInUserDetails?.ParentId;
    if (routename === "dashboard") {
      this.router.navigate(['dashboard']);
    } else if (routename === "configuration") {
      this.router.navigate([`${id}/configuration`]);
    } else if (routename === "userProfile") {
      this.router.navigate([`agencies/${id}/user-profile`]);
    } else if (routename === 'corporate') {
      this.router.navigate([`${id}/corporate`]);
    } else if (routename === 'branch') {
      this.router.navigate([`${id}/branch`]);
    } else if (routename === 'staff') {
      this.router.navigate([`agency/${id}/staff`]);
    } else if (routename === 'booking') {
      this.router.navigate([`booking`]);
    } else if (routename === 'report') {
      this.router.navigate([`report`]);
    } else if (routename) {
      this.router.navigate([`${id}/corporate/${corpId}/${routename}`]);
    }
    this.agencyDisplay = false;
    this.corporateDisplay = false;
    this.branchDisplay = false;
    this.bookingDisplay = false;
  };

  updateUserSubscription() {
    this.tokenService.userTokenExpiration.subscribe(() => {
      this.currentUser = null;
      this.userService.logOut();
    });
    this.userService.updateUserInfo.subscribe((UserInfo) => {
      this.currentUser = UserInfo;
      if (!this.storageService.getItems('branchDetail')) {
        this.selectedItem = this.getBranchNameFromMap();
      } else {
        this.selectedItem = this.storageService.getItems('branchDetail')?.id;
      }
    });
  }

  logoutAndProfileFunction() {
    this.nbMenuService.onItemClick().pipe(
      filter(({ tag }) => tag === 'my-context-menu'),
      map(({ item: { title } }) => title),
    ).subscribe((title) => {
      if (title === 'Log out') {
        this.userService.updateState.subscribe(() => {
          this.currentUser = null;
        })
        this.loginService.emitChange({ 'authentication': false })
        this.userService.logOut();
      } else {
        this.router.navigate([`/profile`]);
      }
    });
  }

  getBranchNameFromMap(id: string = null) {
    let branchId = id ?? this.currentUser?.selectedBranch;
    if (branchId && this.currentUser.branchIdNameMap) {
      let selectedBranchMap = this.currentUser.branchIdNameMap.filter(b => b.Id == branchId)[0];
      this.storageService.setBranchDetail(selectedBranchMap.Id);
      return selectedBranchMap.Id;
    }
    this.storageService.setBranchDetail(branchId);
    return branchId;
  }
}
