import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { DashbaordService } from '../../../lib/services/dashboard/dashbaord.service';
import { ExcelService } from '../../../lib/services/excel-service/excel.service';
import { UserService } from '../../../lib/services/user-service/user.service';

@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor(private readonly fb: FormBuilder, private readonly dashboardServiceData: DashbaordService, private readonly userService: UserService, private readonly excelService: ExcelService) { }

  branchId: any;
  userInfo: any
  reportform: FormGroup;
  types = [
    'Flights Report',
    'Flights by city',
    'Total flight Bookings',
    'Sales by Agent',
    'Sales by Airline',
    'Sales by International',
    'Sales by Domestic',
    'Hotels Report',
    'Hotel by city',
    'Total Hotel Booking',
    'Sales By Corporate',
    'Flight by Corporate'
  ];
  month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  year = ['2021', '2022'];

  ngOnInit(): void {
    if (this.userService.UserInfo) {
      this.userInfo = this.userService.UserInfo;
      this.branchId = this.getBranchNameFromMap();
    }
    this.createdownloadform();
  }

  createdownloadform() {
    this.reportform = this.fb.group({
      "reporttype": [this.types[0]],
      "bookingMonth": [this.month[0]],
      "bookingYear": [this.year[0]],
    })
  }

  getBranchNameFromMap(id: string = null) {
    let branchId = id ?? this.userInfo?.selectedBranch;
    if (branchId && this.userInfo.branchIdNameMap) {
      let selectedBranchMap = this.userInfo.branchIdNameMap.filter(b => b.Id == branchId)[0];
      return selectedBranchMap.Id;
    }
    return branchId;
  }

  downloadForm() {
    let filterType = this.reportform.value.reporttype;
    let month = this.month.indexOf(this.reportform.value.bookingMonth);
    let year = this.reportform.value.bookingYear;

    let startDate = moment([year, month]).format("YYYY-MM-DDThh:mm:ss.sss")

    let endDate = moment(startDate).clone().endOf('month').format("YYYY-MM-DDThh:mm:ss.sss")

    let filterBody = {
      'From': startDate,
      'To': endDate,
      'ProductType': 'Flight'
    };

    if (filterType === 'Flights Report') {
      this.dashboardServiceData.fetchDashboardData(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'Flight');

      })
    } else if (filterType === 'Flights by city') {
      this.dashboardServiceData.fetchDashboardDataByCity(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'FlightByCity');
      })
    } else if (filterType === 'Total flight Bookings') {
      this.dashboardServiceData.fetchDataForCorporate(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody.From, filterBody.To, filterBody.ProductType).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'FlightBooking');
      })
    } else if (filterType === 'Sales by Agent') {
      this.dashboardServiceData.fetchDashboardDataByAgent(this.userInfo?.agencyId, this.branchId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'SalesByAgent');
      })
    } else if (filterType === 'Sales by Airline') {
      this.dashboardServiceData.fetchDashboardDataByAirline(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'SalesByAirline');
      })
    } else if (filterType === 'Sales by International') {
      let filterBody = {
        'From': startDate,
        'To': endDate,
        'ProductType': 'Flight',
        'TripType': 'International'
      };
      this.dashboardServiceData.fetchDashboardDataByInternational(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'SalesByInternational');
      })
    } else if (filterType === 'Sales by Domestic') {
      let filterBody = {
        'From': startDate,
        'To': endDate,
        'ProductType': 'Flight',
        'TripType': 'Domestic'
      };
      this.dashboardServiceData.fetchDashboardDataByDomestic(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'SalesByDomestic');
      })
    } else if (filterType === 'Hotels Report') {
      let filterBody = {
        'From': startDate,
        'To': endDate,
        'ProductType': 'Hotel'
      };
      this.dashboardServiceData.fetchDashboardData(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'Hotel');
      })
    } else if (filterType === 'Hotel by city') {
      let filterBody = {
        'From': startDate,
        'To': endDate,
        'ProductType': 'Hotel'
      };
      this.dashboardServiceData.fetchDashboardDataByCity(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'HotelBycity');
      })
    } else if (filterType === 'Total Hotel Booking') {
      let filterBody = {
        'From': startDate,
        'To': endDate,
        'ProductType': 'Hotel'
      };
      this.dashboardServiceData.fetchDataForCorporate(this.userInfo?.agencyId, this.branchId, this.userInfo?.corporateId, filterBody.From, filterBody.To, filterBody.ProductType).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'HotelBookings');
      })
    } else if (filterType === 'Sales By Corporate') {
      this.dashboardServiceData.fetchDashboardDataByCorporate(this.userInfo?.agencyId, this.branchId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'SalesByCorporate');
      })
    } else if (filterType === 'Flight by Corporate') {
      this.dashboardServiceData.fetchDashboardDataByCorporate(this.userInfo?.agencyId, this.branchId, filterBody).subscribe((res: any) => {
        this.excelService.exportAsExcelFile(res.items, 'FlightByCorporate');
      })
    }
  }
}
