import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private readonly apiService: ApiService) { }

  fetchEmployee(params,emailId?) {
    if(emailId == "" || emailId == undefined){
      let param = new HttpParams().set('PageSize', 20)
    const url = `${environment.apiUrls.profileApi}agencies/${params.id}/corporates/${params.corpId}/emp?Type=CorporateEmployee`;
    return this.apiService.get(url, { param });
    }else{
      let param = new HttpParams().set('PageSize', 20).set('EmailId', emailId);;
    const url = `${environment.apiUrls.profileApi}agencies/${params.id}/corporates/${params.corpId}/emp?Type=CorporateEmployee`;
    return this.apiService.get(url, { param });
    }
    
  };

  fetchEmployeedata(parentParams, childParams) {
    const url = `${environment.apiUrls.profileApi}agencies/${parentParams.id}/corporates/${parentParams.corpId}/emp/${childParams.emailId}`;
    return this.apiService.get(url);
  };

  deleteEmployee(params, res) {
    const url = `${environment.apiUrls.profileApi}agencies/${params.id}/corporates/${params.corpId}/emp/${res.emailId}`;
    return this.apiService.delete(url);
  };

  updateEmployee(params, res) {
    const url: string = `${environment.apiUrls.profileApi}agencies/${params.id}/corporates/${params.corpId}/emp/${res.emailId}`;
    return this.apiService.put(url, res, {});
  }

  updateEmployeestatus(res) {
    /**TODO: Need to discuss frequentFlyer*/
    res.frequentFlyer = [{ 'airlineCode': 'ABC', 'ffNumber': '1234567' }];
    const url: string = `${environment.apiUrls.profileApi}agencies/${res.agencyId}/corporates/${res.parentId}/emp/${res.emailId}`;
    return this.apiService.put(url, res, {});
  }

  fetchEmpGroup(params) {
    const url: string = `${environment.apiUrls.profileApi}agencies/${params.id}/corporates/${params.corpId}/empgroups?PageSize=40`
    return this.apiService.get(url);
  }

  fetchProfileGroup(params) {
    const url: string = `${environment.apiUrls.profileApi}agencies/${params.id}/corporates/${params.corpId}/profiles`
    return this.apiService.get(url);
  }

  registerEmployee(params, data) {
    const url: string = ` ${environment.apiUrls.profileApi}agencies/${params.id}/corporates/${params.corpId}/emp`
    let hostName: string = window.location.hostname.includes('localhost') ? 'qa-hma.techspian.com' : window.location.hostname;

    let headers = new HttpHeaders({ 'domain': hostName });
    let options = { headers: headers };
    return this.apiService.post(url, data, options);

  }

  generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}
