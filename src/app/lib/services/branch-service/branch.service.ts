import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private readonly apiService: ApiService) { }

  fetchBranches(id) {
    const url = `${environment.apiUrls.profileApi}agencies/${id}/branches`;
    return this.apiService.get(url);
  }

  fetchBranchdata(agency, branch) {
    const url = `${environment.apiUrls.profileApi}agencies/${agency.id}/branches/${branch.branchId}`;
    return this.apiService.get(url);
  }

  updateBranch(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.parentId}/branches/${data.id}`;
    return this.apiService.put(url, data);
  }

  deleteBranch(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.parentId}/branches/${data.id}`;
    return this.apiService.delete(url);
  };

  createBranch(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.parentId}/branches`;
    return this.apiService.post(url, data);
  }
}
