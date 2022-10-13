import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../api-service/api.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WalletServiceService {

  constructor(private readonly apiService: ApiService, private _httpClient: HttpClient,private readonly datePipe: DatePipe) { }

  walletParticularCorporate(agencyId: any, corporateId: any) {
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}`;
    return this.apiService.get(url);
  }

  walletMoneyApi(agencyId: any, corporateId: any, walletId: any) {
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/wallet/${walletId}`;
    return this.apiService.get(url);
  }

  addMoneyInWalletApi(agencyId: string, corporateId: string, walletId: string ,Credit: number, transactionMode: string, remark: string) {
    let body = {
      Credit: Credit,
      TransactionMode: transactionMode,
      Remark: remark
    };
    var url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/wallet/${walletId}/transact`;
    return this._httpClient.post<any>(url, body);
  }

  corporateTransactionApi(agencyId: string, corporateId: string, walletId: string, month: number, year: string, pageSize: number) {
    let params = new HttpParams()
    .set('Month', month)
    .set('Year', year)
    .set('PageSize',pageSize)
    var url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/wallet/${walletId}/statement`;
    return this._httpClient.get<any>(url, {params});
  }
 
  activateWallet(agencyId: string, corporateId: string, walletId: string) {
    var url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/wallet/${walletId}/activate`;
    return this._httpClient.post<any>(url, null);
  }

  deactivateWallet(agencyId: string, corporateId: string, walletId: string) {
    var url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corporateId}/wallet/${walletId}/deactivate`;
    return this._httpClient.post<any>(url, null);
  }

  createWallet(res, agencyId, corpId) {
    const url = `${environment.apiUrls.profileApi}agencies/${agencyId}/corporates/${corpId}/wallet`;
    return this.apiService.post(url, res, {});
  }

  updateWallet(res, request) {    
    const url = `${environment.apiUrls.profileApi}agencies/${request.agency}/corporates/${request.corpId}/wallet/${request.walletId}`;
    return this.apiService.put(url, res, {});
  }
}
