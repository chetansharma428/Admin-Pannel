import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class CorporateGroupService {

  constructor(private readonly apiService: ApiService,
    private _httpClient: HttpClient) { }

    fetchCorporateGroups(agencyId, corporateId, pageSize) {
      let params = new HttpParams()
      .set('PageSize', pageSize)
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/empgroups`;
      return this.apiService.get(url, {params});
    }

    fetchPolicyDetails(agencyId, corporateId,) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/policies/`;
      return this.apiService.get(url);
    }

    createGroupAPi(agencyId, corporateId,id: string, name: string, policies: Array<any>) {
      let body = {
        Id: id,
        Name: name,
        policies: policies
      };
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/empgroups`;
      return this.apiService.post(url, body);
    }

    getGroupDetails(agencyId, corporateId, groupId) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/empgroups/${groupId}`;
      return this.apiService.get(url);
    }

    updateGroupAPi(agencyId, corporateId, id: string, name: string, policies: Array<any>, parentId, groupId, ) {
      let body = {
        parentId: parentId,
        Id: id,
        Name: name,
        policies: policies
      };
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/empgroups/${groupId}`;
      return this.apiService.put(url, body);
    }

    deleteGroup(agencyId, corporateId, groupId) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/empgroups/${groupId}`;
      return this.apiService.delete(url);
    }
}
