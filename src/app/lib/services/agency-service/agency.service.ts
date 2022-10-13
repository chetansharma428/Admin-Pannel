import { UserDetails, UserObject } from './../../models/user';
import { QueryParams } from './../../models/constants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api-service/api.service';
import { UserInfo } from '../../models/userInfo';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  constructor(private readonly apiService: ApiService) { }

  UserInfo: UserInfo;

  getUserInfo() {
    return this.UserInfo;
  }

  public setUserInfo(user: UserObject, usertype: string, isPersonal: boolean, isB2cUser: boolean = false ,isPortalRedirectedUser = false) {
    this.UserInfo = {
      token: user.token,
      emailId: user.userDetails.EmailId,
      userType: usertype,
      title: user.userDetails.Title,
      firstName: user.userDetails.FirstName,
      lastName: user.userDetails.LastName,
      mobileNo: user.userDetails.MobileNo,
      parentId: user.userDetails.ParentId,
      agencyId: user.userDetails.SearchType == 'agencyuser' ? user.userDetails.ParentId : (user.userDetails.AgencyId || "AGENCYID-TEST-5000"),
      agencyName: user.agencyName,
      profileId: user.userDetails.ProfileId,
      availPoint: 123, //Temp Number,
      branchIds: user.userDetails.BranchIds,
      branchIdNameMap: user.userDetails.BranchIdNameMap,
      selectedBranch: user.userDetails.BranchIds ? user.userDetails.BranchIdNameMap[0]?.Id : null,
      isPersonal: isPersonal,
      corporateId: user.userDetails.SearchType == 'corporateemployee' ? user.userDetails.ParentId : null,
      designation: user.userDetails.Designation,
      code: user.userDetails.EmployeeId,
      approverIds: user.userDetails.approverIds,
      department: user.userDetails.Department,
      corporateName: usertype === 'corporateemployee' || usertype === 'corporateAdmin' ? user.userDetails.ParentId : null,
      employeeGroupId: user.userDetails.EmpGroupId,
      projectId: user.userDetails.ProfileId,
      agencyPointOfContactId: user.agencyPointOfContactId,
      corporatePointOfContactId: user.corporatePointOfContactId,
      address: {
        AddressLine1: user.userDetails.Address?.AddressLine1,
        AddressLine2: user.userDetails.Address?.AddressLine2,
        AddressLine3: user.userDetails.Address?.AddressLine3,
        City: user.userDetails.Address?.City,
        Country: user.userDetails.Address?.City,
        FaxNo: user.userDetails.Address?.FaxNo,
        MobileNo: user.userDetails.Address?.MobileNo,
        PhoneNo1: user.userDetails.Address?.PhoneNo1,
        PhoneNo2: user.userDetails.Address?.PhoneNo2,
        State: user.userDetails.Address?.State,
        Zip: user.userDetails.Address?.Zip,
      },
      branchPointOfContact: user.branchPointOfContact,
      branchPointOfContactId: user.branchPointOfContactId,
      branchLocationCode: user.branchLocationCode,
      branchName: user.branchName,
      isB2cUser: isB2cUser,
      isPortalRedirectedUser : isPortalRedirectedUser
    }
    return this.UserInfo;
  }

  public getAgencyAccess(userDetails: UserDetails): Observable<any> {
    const url: string = `${environment.apiUrls.profileApi}agencies/${userDetails.AgencyId}/profiles/${userDetails.ProfileId}`;
    return this.apiService.get(url);
  };

  public getAgencyDetails(userDetails: UserDetails): Observable<any> {
    const url: string = `${environment.apiUrls.profileApi}agencies/${userDetails.AgencyId}`;
    return this.apiService.get(url);
  }

  public getAgencyBranches(userDetails: UserDetails, userType: string): Observable<any> {
    const url: string = `${environment.apiUrls.profileApi}agencies/${userDetails.AgencyId}/branches/`;
    let queryParam: string = null;
    if (userType == 'agencyemployee') {
      let branchIds = userDetails.BranchIds;
      for (let i = 0; i < branchIds.length; i++) {
        let param = `branchIds[${i}]=${branchIds[i]}`;
        if (!queryParam)
          queryParam = param;
        else
          queryParam = `${queryParam}&${param}`
      }
    }
    if (queryParam)
      return this.apiService.get(`url?${queryParam}`);
    else
      return this.apiService.get(url);
  }

  public getCorporateAccess(userDetails: UserDetails, isRedirecteduser: boolean = false) {
    const url: string = `${environment.apiUrls.profileApi}agencies/${userDetails.AgencyId}/corporates/${userDetails.ParentId}/profiles/${userDetails.ProfileId}`;
    return this.apiService.get(url);
  }

  public getCorporateSync(userDetails: UserDetails, id: string) {
    var url = `${environment.apiUrls.profileApi}agencies/${userDetails.AgencyId}/corporates/${id}`;
    return this.apiService.get(url);
  }
}
