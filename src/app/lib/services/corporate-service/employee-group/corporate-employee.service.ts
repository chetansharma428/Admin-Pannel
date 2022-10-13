import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../api-service/api.service';
import { environment } from '../../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})

export class CorporateEmployeeService {

  constructor(private readonly apiService: ApiService,
    private _httpClient: HttpClient) { }

  fetchCorporateEmployees(agencyId, corporateId) {
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/profiles`;
    return this.apiService.get(url);
  }

  deleteCorporateEmployee(agencyId, data) {
    // const agencyId = this.storageService.getItems('loggedinUserdetails')?.userDetails.AgencyId;
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${data.organizationId}/profiles/${data.id}`;
    return this.apiService.delete(url);
  }

  fetchCorporatePermissionList() {
    let params = new HttpParams()
    .set('orgType', 'Corporate')
    const url = `${environment.apiUrls.profileApi}profiles/permissions`;
    return this.apiService.get(url, {params});
  }

  addProfileInCorporate(agencyId, corporateId, name: string, description: string, permissions:Array<any>) {
    let body = {
      Name: name,
      Description: description,
      PermissionsList: permissions
    };
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/profiles`;
    return this._httpClient.post<any>(url, body);

    // return this.apiService.post(url, body)
  }

  getCorporateEmployeeProfile(agencyId, corporateId, profileId) {
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/profiles/${profileId}`;
    return this.apiService.get(url);
  }

  updateProfileInCorporate(agencyId, corporateId, name: string, description: string, permissions:Array<any>, profileId) {
    let body = {
      Name: name,
      Description: description,
      PermissionsList: permissions
    };
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/profiles/${profileId}`;
    return this._httpClient.put<any>(url, body);
  }

}
