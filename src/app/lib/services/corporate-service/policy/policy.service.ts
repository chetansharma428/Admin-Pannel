import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../api-service/api.service';
import { StorageService } from '../../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private readonly storageService: StorageService,private readonly apiService: ApiService,
    private _httpClient: HttpClient) { }

    fetchPolicies(agencyId, corporateId) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/policies/`;
      return this.apiService.get(url);
    }

    createPolicyApi(agencyId, corporateId, value) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/policies`;
      return this.apiService.post(url, value);
    }

    deletePolicy(agencyId, corporateId, policyId) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/policies/${policyId}`;
      return this.apiService.delete(url);
    }

    fetchPolicybyId(agencyId, corporateId ,policyId) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/policies/${policyId}`;
      return this.apiService.get(url);
    }

    updatePolicyApi(agencyId, corporateId, value, policyId) {
      const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/policies/${policyId}`;
      return this.apiService.put(url, value);
    }
}
