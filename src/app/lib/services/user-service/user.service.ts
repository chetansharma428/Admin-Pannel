import { EventEmitter, Injectable, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { BranchIdNameMap, UserObject } from '../../models/user';
import { UserInfo } from '../../models/userInfo';
import { AgencyService } from '../agency-service/agency.service';
import { StorageService } from '../storage-service/storage.service';
import { TokenServiceService } from '../token-service/token-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userType: string;
  public isAuthenticated$ = new BehaviorSubject<Boolean>(false);
  public isMessage$ = new BehaviorSubject<String>('');
  public _userInfo: Observable<UserInfo> = null;
  private currentUserSubject: BehaviorSubject<UserInfo>;
  updateUserInfo = new EventEmitter();
  public token = null;
  private _isLoggedIn = false;
  updateState = new EventEmitter();

  constructor(private readonly storageService: StorageService,
    private readonly agencyService: AgencyService, private readonly service: NbAuthService,
    private readonly router: Router, private readonly tokenService: TokenServiceService) {
    if (this.storageService.getItems('loggedUserstatus'))
      this.isAuthenticated$.next(this.storageService.getItems('loggedUserstatus'));

    this.currentUserSubject = new BehaviorSubject<UserInfo>(this.storageService.getItems('userInfo'));
    this._userInfo = this.currentUserSubject.asObservable();
    if (this.UserInfo != null) {
      this._isLoggedIn = true;
    }

    if(this.tokenService.expirationSession == null && this.UserInfo) {
      this.tokenService.setSilentExpiration(this.UserInfo.token);
    }
  }

  isLoggedIn(request) {
    this.service.authenticate('email', request).subscribe((res: NbAuthResult) => {
      if (res.isSuccess()) {
        const response = res.getResponse();
        this.storageService.setLoggeduserStatus(res.isSuccess());
        this.isAuthenticated$.next(this.storageService.getItems('loggedUserstatus'));
        response.body.userDetails = JSON.parse(response.body.userDetails);
        this.storageService.setLoggedinUserDetails(response.body);
        this.token = response.body.token;
        this.createUserInfo(response.body, false);
        this.router.navigate(['/dashboard']);
      } else {
        this.isMessage$.next('Failed');
      }
    });
  }

  public logOut(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticated$.next(false);
    this.updateState.emit();
    this.storageService.clear();
    this.token = null;
    this.router.navigate(['/auth']);
    this.tokenService.stopSilentExpiration();
  }

  get UserInfo(): UserInfo {
    return this.currentUserSubject.value;
  }

  set UserInfo(val: UserInfo) {
    this.storageService.setUserInfo(val);
    this.currentUserSubject.next(val);
  }

  createUserInfo(user, isPersonal: boolean, isRedirectedUser: boolean = false , isB2cUser : boolean =false) {
    if (user.userDetails.SearchType == "agencyuser") {
      this.createAgencyUserInfo(user, isPersonal)
    } else if (user.userDetails.SearchType == "corporateemployee") {
      this.createCorporateUserInfo(user, isPersonal, isRedirectedUser, isB2cUser)
    }
  };

  createAgencyUserInfo(user: UserObject, isPersonal): void {
    user.userDetails.AgencyId = user.userDetails.ParentId;

    const getAgencyAccess$ = this.agencyService.getAgencyAccess(user.userDetails);
    const getAgencyDetails$ = this.agencyService.getAgencyDetails(user.userDetails);

    forkJoin([getAgencyAccess$, getAgencyDetails$]).pipe(
      tap(data => data),
      concatMap(data => {
        this.userType = data[0].permissionsList.includes("agency-full-access") ? "agencyAdmin" : "agencyemployee";
        this.storageService.setPermissionDetails(data);
        return this.agencyService.getAgencyBranches(user.userDetails, this.userType);
      })
    ).subscribe(res => {
      this.storageService.setBranchDetails(res);
      const branchIds = res.items.map(item => item.id);
      const branchMap: BranchIdNameMap[] = res.items.map(item => ({ Id: item.id, Name: item.name, status: item.isActive }));
      const newData = branchMap.filter((item:any) => item?.status === true);
      user.userDetails.BranchIds = branchIds;
      user.userDetails.BranchIdNameMap = newData;
      this.setUserInfo(user, this.userType, isPersonal, isPersonal);
    })
  };

  createCorporateUserInfo(user: UserObject, isPersonal: boolean, isRedirecteduser: boolean = false , isB2cUser: boolean = false) {
    const getCorporateAccess$ = this.agencyService.getCorporateAccess(user.userDetails, isRedirecteduser);

    forkJoin([getCorporateAccess$]).pipe(
      tap(res => res),
      concatMap((res1: any) => {
        this.userType = res1[0].permissionsList.includes("corporate-full-access") ? "corporateAdmin" : "corporateemployee";
        this.storageService.setSelfUserDetails(user.userDetails);
        this.storageService.setPermissionDetails(res1);

        return res1;
      })
    ).subscribe(data => {
      const userData = this.agencyService.getCorporateSync(user.userDetails,user.userDetails.ParentId).pipe().subscribe((corporateDetails:any) => {
        this.storageService.setCorporateDetails(corporateDetails);
        user.userDetails.BranchIds = corporateDetails?.associatedOrgId;
        user.userDetails.BranchIdNameMap = [];
        this.setUserInfo(user, this.userType, isPersonal,isB2cUser);
      })
    })
  }

  public setUserInfo(user: UserObject, usertype: string, isPersonal: boolean, isB2cUser: boolean = false , isPortalRedirectedUser = false) {
    this.UserInfo = this.agencyService.setUserInfo(user, usertype, isPersonal, isB2cUser, isPortalRedirectedUser);
    this.tokenService.setSilentExpiration(user.token);
    this.currentUserSubject.next(this.UserInfo);
    this.updateUserInfo.next(this.UserInfo);
  }

}
