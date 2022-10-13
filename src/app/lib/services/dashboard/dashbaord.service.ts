import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashbaordService {

  constructor(private readonly apiService: ApiService) { }

  fetchDataForCorporate(agencyId, branchId, corporateId, bookingFromDate, bookingToDate, productType) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "CorporateId": corporateId,
      "BookingsDateFrom": bookingFromDate,
      "BookingsDateTo": bookingToDate,
      "ProductType": productType
    }
    const url = `${environment.apiUrls.cartAPI}stats/bookings`;
    return this.apiService.post(url, body);
  }

  fetchDashboardData(agencyId, branchId, corporateId, filter) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "CorporateId": corporateId,
      "Granularity": "Daily",
      "Filter": filter
    }
    const url = `${environment.apiUrls.cartAPI}stats/performance`;
    return this.apiService.post(url, body);
  }

  fetchDashboardDataByCity(agencyId, branchId, corporateId, filter) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "CorporateId": corporateId,
      "Granularity": "Daily",
      "Filter": filter,
      "Category": "City"
    }
    const url = `${environment.apiUrls.cartAPI}stats/performance`;
    return this.apiService.post(url, body);
  }

  fetchDashboardDataByAirline(agencyId, branchId, corporateId, filter) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "CorporateId": corporateId,
      "Granularity": "Daily",
      "Filter": filter,
      "Category": "Airline"
    }
    const url = `${environment.apiUrls.cartAPI}stats/performance`;
    return this.apiService.post(url, body);
  }

  fetchDashboardDataByDomestic(agencyId, branchId, corporateId, filter) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "CorporateId": corporateId,
      "Granularity": "Daily",
      "Filter": filter,
    }
    const url = `${environment.apiUrls.cartAPI}stats/performance`;
    return this.apiService.post(url, body);
  }

  fetchDashboardDataByInternational(agencyId, branchId, corporateId, filter) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "CorporateId": corporateId,
      "Granularity": "Daily",
      "Filter": filter,
    }
    const url = `${environment.apiUrls.cartAPI}stats/performance`;
    return this.apiService.post(url, body);
  }

  fetchDashboardDataByCorporate(agencyId, branchId, filter) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "Granularity": "Daily",
      "Filter": filter,
      "Grouping": "Corporate"
    }
    const url = `${environment.apiUrls.cartAPI}stats/performance`;
    return this.apiService.post(url, body);
  }

  fetchDashboardDataByAgent(agencyId, branchId, filter) {
    let body = {
      "AgencyId": agencyId,
      "BranchId": branchId,
      "Granularity": "Daily",
      "Filter": filter,
      "Grouping": "Facilitator"
    }
    const url = `${environment.apiUrls.cartAPI}stats/performance`;
    return this.apiService.post(url, body);
  }
}
