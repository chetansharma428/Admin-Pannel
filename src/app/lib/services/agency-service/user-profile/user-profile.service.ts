import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private readonly apiService: ApiService,
    private _httpClient: HttpClient) { }

    fetchAgenciesProfile(agencyId) {
      let params = new HttpParams().set('PageSize', 500)
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/profiles`;
      return this.apiService.get(url, {params});
    }

    fetchAgenciesPermissionList() {
      let params = new HttpParams().set('orgType', 'Agency')
      const url = `${environment.apiUrls.profileApi}profiles/permissions`;
      return this.apiService.get(url, {params});
    }

    createAgencyUserProfile(agencyId, name: string, description: string, permissions:Array<any>) {
      let body = {
        Name: name,
        Description: description,
        PermissionsList: permissions
      };
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/profiles`;
      return this._httpClient.post<any>(url, body);
    }

    deleteAgencyUserProfile(agencyId, data) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/profiles/${data.id}`;
      return this._httpClient.delete<any>(url);
    }

    getAgencyProfile(agencyId, profileId) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/profiles/${profileId}`;
      return this.apiService.get(url);
    }

    updateAgencyUserProfile(agencyId, name: string, description: string, permissions:Array<any>, profileId) {
      let body = {
        Name: name,
        Description: description,
        PermissionsList: permissions
      };
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/profiles/${profileId}`;
      return this._httpClient.put<any>(url, body);
    }

}
