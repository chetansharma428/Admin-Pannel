import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  constructor(private readonly apiService: ApiService,) { }

  fetchRevenueData(data, branchId, corporateId,) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateId
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const url = `${environment.apiUrls.channels}RuleSets`;
    return this.apiService.get(url, requestOptions);
  }

  createRevenueRule(data, branchId, corporateId, providerData) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateId
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    let newData = [];
    newData.push(providerData);
    const url = `${environment.apiUrls.channels}RuleSets`;
    return this.apiService.post(url, newData, requestOptions);
  }
}
