import { Injectable } from '@angular/core';
import { ApiService } from '../../api-service/api.service';
import { StorageService } from '../../storage-service/storage.service';
import { environment } from '../../../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CorporateService {

  constructor(private readonly apiService: ApiService, private readonly storageService: StorageService) { }

  fetchCorporates(data, branchId,searchId?) {
    if(searchId == "" || searchId==undefined){
      let params = new HttpParams().set('AssociatedOrgId', branchId).set('PageSize', 20);
    const url = `${environment.apiUrls.profileApi}agencies/${data.id}/corporates`;
    return this.apiService.get(url, { params });
    }else{
      let params = new HttpParams().set('AssociatedOrgId', branchId).set('PageSize', 20).set('Id', searchId);
      const url = `${environment.apiUrls.profileApi}agencies/${data.id}/corporates`;
      return this.apiService.get(url, { params });
    }
  
  };

  deleteCorporate(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.parentId}/corporates/${data.id}`;
    return this.apiService.delete(url);
  };

  updateCorporate(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.parentId}/corporates/${data.id}`;
    return this.apiService.put(url, data);
  };

  fetchCorporatedata(data, branchId) {
    let params = new HttpParams()
    .set('AssociatedOrgId', branchId)
    const url = `${environment.apiUrls.profileApi}agencies/${data.id}/corporates/${data.corpId}`;
    return this.apiService.get(url, {params});
  };

  activate(res) {
    let url: string;
    let body = {};
      url = `${environment.apiUrls.profileApi}agencies/${res.parentId}/corporates/${res.id}/activate`;
      /**TODO: Need to change verified domain. */
      body = {
        ValidDomain: 'test.com'
      }

    return this.apiService.post(url, body, {});
  };

  deactivate(res) {
    let url: string;
    url = `${environment.apiUrls.profileApi}agencies/${res.parentId}/corporates/${res.id}/deactivate`;
    return this.apiService.post(url, {}, {});
  }

  createCorporate(value) {
    const agencyId = this.storageService.getItems('loggedinUserdetails')?.userDetails?.ParentId;
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates`;
    /**TODO: Need to change domain. */
    let hostName: string = window.location.hostname.includes('localhost') ? 'qa-hma.techspian.com' : window.location.hostname;

    let headers = new HttpHeaders({ 'domain': hostName });
    let options = { headers: headers };
    return this.apiService.post(url, value, options);
  };

  generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

}
