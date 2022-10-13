import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../storage-service/storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  constructor(private readonly apiService: ApiService, private readonly storageService: StorageService) { }

  fetchProviderDetails(data, branchId, corporateId,) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateId
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const url = `${environment.apiUrls.channels}Providers`;
    return this.apiService.get(url, requestOptions);
  }

  deleteProvider(data, branchId) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId':data.corpId
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const url = `${environment.apiUrls.channels}Providers`;
    return this.apiService.delete(url, requestOptions);
  }

  createProviders(data, branchId, corporateId, providerData) {
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
    const url = `${environment.apiUrls.channels}Providers`;
    return this.apiService.post(url, newData, requestOptions);
  }

  getCorporate(res, branchId, parentParam) {
    // const user = this.storageService.getItems('loggedinUserdetails')?.userDetails;
    // const branchId = this.storageService.getItems('branchDetail')?.id;
    const url = `${environment.apiUrls.profileApi}agencies/${parentParam.id}/corporates?isActive=true&AssociatedOrgId=${branchId}&Name=${res}`;
    return this.apiService.get(url).pipe(map((res: any) => res.items));
  }

}
