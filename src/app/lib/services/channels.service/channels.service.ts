import { Injectable } from '@angular/core';
import { ApiService } from '../api-service/api.service';
import { environment } from '../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  value: Observable<any>;

  constructor(private readonly apiService: ApiService) { }

  fetchChannelDetails(data, branchId, corporateid) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateid
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    const url = `${environment.apiUrls.channels}Channels`;
    return this.apiService.get(url, requestOptions);
  }

  deleteChannel(data, branchId) {
    // const headerDict = {
    //   'agencyId': data.id,
    //   'branchId': branchId,
    //   'corporateId':data.corpId
    // }
    // const requestOptions = {
    //   headers: new HttpHeaders(headerDict),
    // };
    // const url = `${environment.apiUrls.channels}Channels`;
    // return this.apiService.delete(url, requestOptions);
    return observable.valueOf();
  }

  createChannelApi(data, branchId, corporateId, channelID: string, batch: string, ProviderList: Array<any>) {
    const headerDict = {
      'agencyId': data.id,
      'branchId': branchId,
      'corporateId': corporateId
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    let body = {
      ChannelId: channelID,
      BatchSize: batch,
      Providers: ProviderList
    };
    let newData = [];
    newData.push(body);
    const url = `${environment.apiUrls.channels}Channels`;
    return this.apiService.post(url, newData, requestOptions);
  }
}
