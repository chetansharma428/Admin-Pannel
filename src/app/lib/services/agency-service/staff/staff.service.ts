import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private readonly apiService: ApiService) { }

  fetchAgencyStaff(id) {
    let param = new HttpParams().set('PageSize', 20);
    const url = `${environment.apiUrls.profileApi}agencies/${id}/staff`;
    return this.apiService.get(url, { param });
  }

  createAgencyStaff(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.parentId}/staff`;
    return this.apiService.post(url, data);
  }

  updateAgencyStaff(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.id}/staff/${data.EmailId}`;
    return this.apiService.put(url, data);
  }

  deleteAgencyStaff(data) {
    const url = `${environment.apiUrls.profileApi}agencies/${data.parentId}/staff/${data.emailId}`;
    return this.apiService.delete(url);
  };

  fetchParticularAgencyStaff(agencyId, id) {
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/staff/${id}`;
    return this.apiService.get(url);
  }

  resendInviteApi(emailId, domain) {
    let params = new HttpParams().set('emailId', '7000@mailinator.com').set('verificationUrl', 'qa.portal.hmatravel.com')
    const url = `${environment.apiUrls.auth}resend/activation`;
    return this.apiService.get(url, {params});
  }
}
