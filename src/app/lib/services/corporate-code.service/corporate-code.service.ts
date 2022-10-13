import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class CorporateCodeService {

  constructor(private readonly apiService: ApiService) { }

  fetchCorporateCodeDetails(data, branchId, corporateid, providerId) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateid
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const url = `${environment.apiUrls.channels}${providerId}#CorporateCodes`;
    return this.apiService.get(url, requestOptions);
  }

  createCorporateCode(data, branchId, corporateId, providerId, corporateCodeData) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateId
    }
      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      let newData = [];
      newData.push(corporateCodeData);
      const url = `${environment.apiUrls.channels}${providerId}#RuleSets`;
      return this.apiService.post(url, newData, requestOptions);
  }
}
