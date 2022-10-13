import { UserDetails } from './../../models/user';
import { Injectable } from '@angular/core';
import { StorageItems } from '../../models/constants';
import { UserInfo } from '../../models/userInfo';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public getIsLoading() {
    localStorage.getItem(StorageItems.IsLoading) === 'true';
  }

  public setIsLoading(value): void {
    localStorage.setItem(StorageItems.IsLoading, value);
  }

  public clear() {
    localStorage.clear();
  }

  public getItems(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public setBranchDetails(data: any) {
    localStorage.setItem('agencyBranchesDetails', JSON.stringify(data));
  }

  public setLoggedinUserDetails(data: any) {
    localStorage.setItem('loggedinUserdetails', JSON.stringify(data));
  }

  public setLoggeduserStatus(data: any) {
    localStorage.setItem('loggedUserstatus', data);
  }

  public setBranchDetail(data: any) {
    if(data) {
      const branch = this.getItems('agencyBranchesDetails')?.items;
      data = branch.filter(res => res.id === data);
      localStorage.setItem('branchDetail', JSON.stringify(data[0]));
    }
  }

  public setSelfUserDetails(userDetails: UserDetails) {
    localStorage.setItem('self', JSON.stringify(userDetails));
  }

  public setCorporateDetails(corporateDetails: any) {
    localStorage.setItem('corporateDetails', JSON.stringify(corporateDetails));
  }

  public getUserInfo(): any {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfo(val: UserInfo) {
    localStorage.setItem('userInfo', JSON.stringify(val));
  }

  public setPermissionDetails(data:any) {
    localStorage.setItem('profileDetail', JSON.stringify(data));
  }

  public dataForChannels(data: any) {
    localStorage.setItem('dataForChannels', JSON.stringify(data));
  }

}
