import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class PassthroughService {

  constructor(private readonly apiService: ApiService,) { }

  fetchPassThroughConfigDetails(data, branchId, corporateId,) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateId
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const url = `${environment.apiUrls.channels}PassThroughConfig`;
    return this.apiService.get(url, requestOptions);
  }

  createPassThroughConfig(data, branchId, corporateId, passThroughConfigData) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateId
    }
      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      let newData = [];
      newData.push(passThroughConfigData);
      const url = `${environment.apiUrls.channels}PassThroughConfig`;
      return this.apiService.post(url, newData, requestOptions);
  }
}
