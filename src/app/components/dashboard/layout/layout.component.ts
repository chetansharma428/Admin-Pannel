import { UserService } from './../../../lib/services/user-service/user.service';
import { StorageService } from './../../../lib/services/storage-service/storage.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DashbaordService } from '../../../lib/services/dashboard/dashbaord.service';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';
import { NbDialogService } from '@nebular/theme';
import * as moment from 'moment';

@Component({
  selector: 'ngx-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  userDetails: any;

  bookingData: any;
  bookingDataForHotel: any;
  updatedData: any;
  updatedDataForHotel: any;
  productType: any;
  branchDetails: any;
  branchId: any;
  userInfo: any
  heading: Array<any> = [];

  dataName = "Bookings";

  bookingDataForFlight$: Observable<any>;
  bookingDataForHotel$: Observable<any>;
  quarterStatsForFlights$: Observable<any>;
  quarterStatsForHotel$: Observable<any>;
  quarterStatsForFlightByCity$: Observable<any>;
  quarterStatsForFlightByAirline$: Observable<any>;
  quarterStatsForFlightByDomestic$: Observable<any>;
  quarterStatsForFlightByInternational$: Observable<any>;
  quarterStatsForHotelByCity$: Observable<any>;
  quarterStatsForCorporate$: Observable<any>;
  quarterStatsForAgent$: Observable<any>;
  statsForCorporateDateVise$: Observable<any>

  loader: boolean = false;
  loaderForCity: boolean;
  loaderForBookingStatus: boolean;
  loaderForAgentSales: boolean;
  loaderForAirline: boolean;
  loaderForDomesticAndInternation: boolean;
  loaderForHotelData: boolean;
  loaderForHotelDataForCity: boolean;
  loaderForHotelBookingData: boolean;
  loaderForCorporateData: boolean;
  loaderForParticularCorporateData: boolean;

  colorOption = [
    { name: 'Invoiced', color: '#2ce69b' },
    { name: 'Failed', color: '#f54260' },
    { name: 'PartiallyCancelled', color: '#ba7fec' },
    { name: 'Cancelled', color: '#ff6b83' },
    { name: 'ConfirmationFailed', color: '#ffa36b' },
    { name: 'Pending', color: '#ffc94d' },
    { name: 'PendingConfirmation', color: '#5dcfe3' },
    { name: 'Reserved', color: '#598bff' }
  ];

  flightOption: Array<any> = [];

  color: Array<any> = [];
  colorHotel: Array<any> = [];
  noDateFoundMessage: boolean;
  maxValueTo = new Date();
  data: any;
  city: Array<any> = [];
  branch: Array<any> = [];
  airline: Array<any> = [];
  startQuarterDate = moment().startOf('quarter').format("YYYY-MM-DDThh:mm:ss.sss");
  endQuarterDate = moment().endOf('quarter').format('YYYY-MM-DD');
  startMonthDate = moment().startOf('month').format("YYYY-MM-DDThh:mm:ss.sss");
  endMonthDate = moment().endOf('month').format('YYYY-MM-DD');
  startWeekDate = moment().startOf('week').format("YYYY-MM-DDThh:mm:ss.sss");
  endWeekDate = moment().endOf('week').format('YYYY-MM-DD');
  filter: Array<any> = [];
  filterDomestic: Array<any> = [];
  filterInternational: Array<any> = [];

  totalSalesInFlightByBranch = 0;
  totalBookingInFlightByBranch = 0;
  totalSalesInFlightByBranchForHotel = 0;
  totalBookingInFlightByBranchForHotel = 0;

  tabResult: any;
  cityDateForHotel: Array<any> = [];
  domecticAndInternationalResult: Array<any> = [];
  domesticBooking = 0;
  internationalBooking = 0;
  corporateData: Array<any> = [];
  agentData: Array<any> = [];
  colorForInterntionalAndDomestic = [];
  corporateDateViseData = [];

  constructor(private storageService: StorageService, private readonly userService: UserService,
    private readonly dashboardServiceData: DashbaordService, private readonly branchStatusService: BranchSavingService,
    private readonly dialog: NbDialogService) {
    if (this.userService.UserInfo) {
      this.userInfo = this.userService.UserInfo;
      this.branchId = this.getBranchNameFromMap();
    }
  }

  ngOnInit() {
    this.userService.updateUserInfo.subscribe((data) => {
      this.userInfo = data;
      this.branchId = this.getBranchNameFromMap();
      if (this.userInfo?.userType === "agencyAdmin") {
        this.salesAndBookingFlightResult(this.userInfo, this.branchId);
        this.salesAndBookingResultByCity(this.userInfo, this.branchId);
        this.bookingStatsForOthers(this.userInfo, this.branchId);
        this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
        this.agentViseResultForFlight(this.userInfo, this.branchId);
        this.salesAndBookingResultByAirlineInFlight(this.userInfo, this.branchId);
        this.salesAndBookingResultByDomesticAndInternationalFlights(this.userInfo, this.branchId);
        this.salesAndBookingResultForHotel(this.userInfo, this.branchId);
        this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
        this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
        this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
        this.corporteViseResultForFlight(this.userInfo, this.branchId);
        this.corporateDateViseResult(this.userInfo, this.branchId);
      } else {
        this.branchId = this.storageService.getItems('corporateDetails')?.associatedOrgId;
        this.bookingStatsForOthers(this.userInfo, this.branchId);
        this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
      }
    })
  }

  showDailog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    });
  }

  getBranchNameFromMap(id: string = null) {
    let branchId = id ?? this.userInfo?.selectedBranch;
    if (branchId && this.userInfo.branchIdNameMap) {
      let selectedBranchMap = this.userInfo.branchIdNameMap.filter(b => b.Id == branchId)[0];
      return selectedBranchMap.Id;
    }
    return branchId;
  }

  //group detail modal
  detail = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  })


  onSubmit() {
    // console.log(this.detail.value);
  }

  onEvento($event) {
    this.tabResult = $event;
    if (this.userInfo?.userType === 'agencyAdmin') {
      this.branchId = this.storageService.getItems('branchDetail')?.id;
    } else {
      this.branchId = this.storageService.getItems('corporateDetails')?.associatedOrgId;
    }

    this.branchStatusService.watchBranchSubject().subscribe((data1) => {
      this.branchDetails = data1;
      this.branchId = this.branchDetails;
      this.storageService.setBranchDetail(this.branchId);
        this.salesAndBookingFlightResult(this.userInfo, this.branchId);
        this.salesAndBookingResultByCity(this.userInfo, this.branchId);
        this.agentViseResultForFlight(this.userInfo, this.branchId);
        this.salesAndBookingResultByAirlineInFlight(this.userInfo, this.branchId);
        this.salesAndBookingResultByDomesticAndInternationalFlights(this.userInfo, this.branchId);
        this.salesAndBookingResultForHotel(this.userInfo, this.branchId);
        this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
        this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
        this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
        this.corporteViseResultForFlight(this.userInfo, this.branchId);
        this.corporateDateViseResult(this.userInfo, this.branchId);
        this.bookingStatsForOthers(this.userInfo, this.branchId);
        this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
    });

    if(this.tabResult.tabTitle != 'Custom') {
      this.bookingStatsForOthers(this.userInfo, this.branchId);
      this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
      this.salesAndBookingFlightResult(this.userInfo, this.branchId);
      this.salesAndBookingResultByCity(this.userInfo, this.branchId);
      this.agentViseResultForFlight(this.userInfo, this.branchId);
      this.salesAndBookingResultByAirlineInFlight(this.userInfo, this.branchId);
      this.salesAndBookingResultByDomesticAndInternationalFlights(this.userInfo, this.branchId);
      this.salesAndBookingResultForHotel(this.userInfo, this.branchId);
      this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
      this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
      this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
      this.corporteViseResultForFlight(this.userInfo, this.branchId);
      this.corporateDateViseResult(this.userInfo, this.branchId);
    }
  }


  bookingStatsForOthers(userInfo, branchId) {
    this.productType = 'Flight';
    var startBookingFrom;
    var endBookingTo;
    if(this.tabResult.tabTitle === 'Current Quarter') {
      startBookingFrom = this.startQuarterDate;
      endBookingTo = this.endQuarterDate;
    } else if(this.tabResult.tabTitle === 'Current Month') {
      startBookingFrom = this.startMonthDate;
      endBookingTo = this.endMonthDate;
    } else if(this.tabResult.tabTitle === 'Current Week') {
      startBookingFrom = this.startWeekDate;
      endBookingTo = this.endWeekDate;
    } else if(this.tabResult.tabTitle === 'Custom') {
      startBookingFrom = moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss');
      endBookingTo = moment(this.detail.get('toDate').value).format('YYYY-MM-DD');
    }

    this.bookingDataForFlight$ = this.dashboardServiceData.fetchDataForCorporate(userInfo?.agencyId, branchId, userInfo?.corporateId, startBookingFrom, endBookingTo, this.productType).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items?.length > 0) {
          this.bookingData = res1.items;
          this.color = [];
          this.updatedData = this.bookingData.map((value) => {return { value: value.count, name: value.status }})
          this.updatedData.forEach((element) => {
            this.colorOption.forEach((element1) => {
              if(element.name === element1.name) {
                this.color.push(element1.color);
              }
            })
          })
          this.bookingData.forEach(element => {
            this.heading.push(element.status);
          });
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          this.updatedData = [{value: '0', name: 'No Data'}];
          this.color = ['#d3d3d3']
        }

      },
      (error) => {
        this.noDateFoundMessage = true;
        this.updatedData = [{value: '0', name: 'No Data'}];
        this.color = ['#d3d3d3']
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ),
      tap(() => this.loader = false)
    );
  }

  bookingStatsForOthersForHotel(userInfo, branchId) {
    this.productType = 'Hotel';
    var startBookingFrom;
    var endBookingTo;
    if(this.tabResult.tabTitle === 'Current Quarter') {
      startBookingFrom = this.startQuarterDate;
      endBookingTo = this.endQuarterDate;
    } else if(this.tabResult.tabTitle === 'Current Month') {
      startBookingFrom = this.startMonthDate;
      endBookingTo = this.endMonthDate;
    } else if(this.tabResult.tabTitle === 'Current Week') {
      startBookingFrom = this.startWeekDate;
      endBookingTo = this.endWeekDate;
    } else if(this.tabResult.tabTitle === 'Custom') {
      startBookingFrom = moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss');
      endBookingTo = moment(this.detail.get('toDate').value).format('YYYY-MM-DD');
    }
    this.bookingDataForHotel$ = this.dashboardServiceData.fetchDataForCorporate(userInfo?.agencyId, branchId, userInfo?.corporateId, startBookingFrom, endBookingTo, this.productType).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items?.length > 0) {
          this.bookingDataForHotel = res1.items;
          this.colorHotel = [];
          this.updatedDataForHotel = this.bookingDataForHotel.map((value) => {return { value: value.count, name: value.status }})
          this.updatedDataForHotel.forEach((element) => {
            this.colorOption.forEach((element1) => {
              if(element.name === element1.name) {
                this.colorHotel.push(element1.color);
              }
            })
          })
          this.bookingData?.forEach(element => {
            this.heading?.push(element.status);
          });
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          this.updatedDataForHotel = [{value: '0', name: 'No Data'}];
          this.colorHotel = ['#d3d3d3']
        }

      },
      (error) => {
        this.noDateFoundMessage = true;
        this.updatedDataForHotel = [{value: '0', name: 'No Data'}];
        this.colorHotel = ['#d3d3d3']
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ),
      tap(() => this.loader = false)
    );
  }

  salesAndBookingFlightResult(userInfo, branchId) {
    this.productType = 'Flight';
    this.filter = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }
    this.filter.push(filterBody);
    this.quarterStatsForFlights$ = this.dashboardServiceData.fetchDashboardData(userInfo?.agencyId, branchId, userInfo?.corporateId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
          this.totalBookingInFlightByBranch = 0;
          this.totalSalesInFlightByBranch = 0;
          res1.items.forEach((element) => {
            this.totalSalesInFlightByBranch += element.sales || 0;
            this.totalBookingInFlightByBranch += element.count || 0;
          })
          this.noDateFoundMessage = false;
      },
      (error) => {
        this.noDateFoundMessage = true;
        this.totalBookingInFlightByBranch = 0;
        this.totalSalesInFlightByBranch = 0;
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ),
      tap(() => this.loader = false)
    )
  }

  salesAndBookingResultForHotel(userInfo, branchId) {
    this.productType = 'Hotel';
    this.filter = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBodyForHotel = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBodyForHotel = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBodyForHotel = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBodyForHotel = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }

    this.filter.push(filterBodyForHotel);
    // console.log(this.filter);
    this.quarterStatsForHotel$ = this.dashboardServiceData.fetchDashboardData(userInfo?.agencyId, branchId, userInfo?.corporateId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
          this.totalBookingInFlightByBranchForHotel = 0;
          this.totalSalesInFlightByBranchForHotel = 0;
          res1.items.forEach((element) => {
            this.totalSalesInFlightByBranchForHotel += element.sales || 0;
            this.totalBookingInFlightByBranchForHotel += element.count || 0;
          })
          this.noDateFoundMessage = false;
      },
      (error) => {
        this.noDateFoundMessage = true;
        this.totalBookingInFlightByBranchForHotel = 0;
        this.totalSalesInFlightByBranchForHotel = 0;
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ),
      tap(() => this.loader = false)
    )
  }

  salesAndBookingResultByCity(userInfo, branchId) {
    this.productType = 'Flight';
    this.filter = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }
    this.filter.push(filterBody);
    this.quarterStatsForFlightByCity$ = this.dashboardServiceData.fetchDashboardDataByCity(userInfo?.agencyId, branchId, userInfo?.corporateId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0) {
          let cityGrouped = {};
          res1.items.forEach((element) => {
            if(!(!!element.city))
            return
            cityGrouped[element.city] = cityGrouped[element.city] ?? {count: 0, sales: 0};
            cityGrouped[element.city].sales += element.sales;
            cityGrouped[element.city].count += element.count;
          })

          this.city = Object.keys(cityGrouped).map((x: string) => {
            return {city: x, sales: cityGrouped[x].sales, count: cityGrouped[x].count}
          })
          this.noDateFoundMessage = false;
        } else {
          this.city = [
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
          ];
        }

      },
      (error) => {
        this.noDateFoundMessage = true;
        this.city = [
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
        ];
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )
  }

  salesAndBookingResultByAirlineInFlight(userInfo, branchId) {
    this.productType = 'Flight';
    this.filter = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }
    this.filter.push(filterBody);
    this.quarterStatsForFlightByAirline$ = this.dashboardServiceData.fetchDashboardDataByAirline(userInfo?.agencyId, branchId,  userInfo?.corporateId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0 ) {
          let cityGrouped = {};
          res1.items.forEach((element) => {
            if(!(!!element.airline))
            return
            cityGrouped[element.airline] = cityGrouped[element.airline] ?? {count: 0, sales: 0};
            cityGrouped[element.airline].sales += element.sales;
            cityGrouped[element.airline].count += element.count;
          })

          this.airline = Object.keys(cityGrouped).map((x: string) => {
            return {city: x, sales: cityGrouped[x].sales, count: cityGrouped[x].count}
          })
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          this.airline = [
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
          ]
        }
      },
      (error) => {
        this.noDateFoundMessage = true;
        this.airline = [
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
        ]
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )
  }

  salesAndBookingResultByDomesticAndInternationalFlights(userInfo, branchId) {
    this.productType = 'Flight';
    this.domesticBooking = 0;
    this.internationalBooking = 0;
    this.filterDomestic = [];
    this.domecticAndInternationalResult = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType,
        'TripType': 'Domestic'
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType,
        'TripType': 'Domestic'
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType,
        'TripType': 'Domestic'
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType,
        'TripType': 'Domestic'
      }
    }

    this.filterDomestic.push(filterBody);
    this.quarterStatsForFlightByDomestic$ = this.dashboardServiceData.fetchDashboardDataByDomestic(userInfo?.agencyId, branchId, userInfo?.corporateId, this.filterDomestic[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0) {
          res1.items?.forEach((element) => {
            this.domesticBooking += element.count || 0;
          })
          this.domecticAndInternationalResult.push({value: this.domesticBooking || 0, name: 'Domestic Booking'});
          this.flightOption = ['Domestic Booking', 'International Booking'];
          this.colorForInterntionalAndDomestic = ['#ffa36b', '#ffc94d']
          this.noDateFoundMessage = false;
        }
      },
      (error) => {
        this.noDateFoundMessage = true;
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )

    this.productType = 'Flight';
    this.filterInternational = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBodyForInternational = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType,
        'TripType': 'International'
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBodyForInternational = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType,
        'TripType': 'International'
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBodyForInternational = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType,
        'TripType': 'International'
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBodyForInternational = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType,
        'TripType': 'International'
      }
    }

    this.filterInternational.push(filterBodyForInternational);
    this.quarterStatsForFlightByInternational$ = this.dashboardServiceData.fetchDashboardDataByInternational(userInfo?.agencyId, branchId, userInfo?.corporateId, this.filterInternational[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0) {
          res1.items?.forEach((element1) => {
            this.internationalBooking += element1.count || 0;
          })
          this.domecticAndInternationalResult.push({value: this.internationalBooking || 0, name: 'International Booking'});
          this.flightOption = ['Domestic Booking', 'International Booking'];
          this.colorForInterntionalAndDomestic = ['#ffa36b', '#ffc94d'];
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          if(this.domecticAndInternationalResult.length === 0) {
            this.domecticAndInternationalResult = [{value: 0, name: 'No Data'}];
            this.colorForInterntionalAndDomestic = ['#d3d3d3']
          }
        }
      },
      (error) => {
        this.noDateFoundMessage = true;
        if(this.domecticAndInternationalResult.length === 0) {
          this.domecticAndInternationalResult = [{value: 0, name: 'No Data'}];
          this.colorForInterntionalAndDomestic = ['#d3d3d3']
        }
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )


  }

  salesAndBookingResultByCityForHotel(userInfo, branchId) {
    this.productType = 'Hotel';
    this.filter = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }

    this.filter.push(filterBody);
    this.quarterStatsForHotelByCity$ = this.dashboardServiceData.fetchDashboardDataByCity(userInfo?.agencyId, branchId, userInfo?.corporateId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0) {
          let cityGrouped = {};
          res1.items.forEach((element) => {
            if(!(!!element.city))
            return
            cityGrouped[element.city] = cityGrouped[element.city] ?? {count: 0, sales: 0};
            cityGrouped[element.city].sales += element.sales;
            cityGrouped[element.city].count += element.count;
          })

          this.cityDateForHotel = Object.keys(cityGrouped).map((x: string) => {
            return {city: x, sales: cityGrouped[x].sales, count: cityGrouped[x].count}
          })
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          this.cityDateForHotel = [
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
          ];
        }
      },
      (error) => {
        this.noDateFoundMessage = true;
        this.cityDateForHotel = [
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
        ];
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )
  }

  corporteViseResultForFlight(userInfo, branchId) {
    this.productType = 'Flight';
    this.filter = [];
    this.corporateData = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }

    this.filter.push(filterBody);
    this.quarterStatsForCorporate$ = this.dashboardServiceData.fetchDashboardDataByCorporate(userInfo?.agencyId, branchId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0 ) {
          let cityGrouped = {};
          res1.items.forEach((element) => {
            if(!(!!element.corporateId))
            return
            cityGrouped[element.corporateId] = cityGrouped[element.corporateId] ?? {count: 0, sales: 0};
            cityGrouped[element.corporateId].sales += element.sales;
            cityGrouped[element.corporateId].count += element.count;
          })

          this.corporateData = Object.keys(cityGrouped).map((x: string) => {
            return {city: x, sales: cityGrouped[x].sales, count: cityGrouped[x].count}
          })
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          this.corporateData = [
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
          ]
        }
      },
      (error) => {
        this.noDateFoundMessage = true;
        this.corporateData = [
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
        ]
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )
  }

  agentViseResultForFlight(userInfo, branchId) {
    this.productType = 'Flight';
    this.filter = [];
    this.corporateData = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }
    this.filter.push(filterBody);
    this.quarterStatsForAgent$ = this.dashboardServiceData.fetchDashboardDataByAgent(userInfo?.agencyId, branchId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0 ) {
          let cityGrouped = {};
          res1.items.forEach((element) => {
            if(!(!!element.facilitatorId))
            return
            cityGrouped[element.facilitatorId] = cityGrouped[element.facilitatorId] ?? {count: 0, sales: 0};
            cityGrouped[element.facilitatorId].sales += element.sales;
            cityGrouped[element.facilitatorId].count += element.count;
          })

          this.agentData = Object.keys(cityGrouped).map((x: string) => {
            return {city: x, sales: cityGrouped[x].sales, count: cityGrouped[x].count}
          })
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          this.agentData = [
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
            {city: 'NA', count: 'NA', amount: 'NA'},
          ]
        }
      },
      (error) => {
        this.noDateFoundMessage = true;
        this.agentData = [
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
          {city: 'NA', count: 'NA', amount: 'NA'},
        ]
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )
  }

  corporateDateViseResult(userInfo, branchId) {
    this.productType = 'Flight';
    this.filter = [];
    if(this.tabResult.tabTitle === 'Current Quarter') {
      var filterBody = {
        'From': this.startQuarterDate,
        'To': this.endQuarterDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Month') {
      var filterBody = {
        'From': this.startMonthDate,
        'To': this.endMonthDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Current Week') {
      var filterBody = {
        'From': this.startWeekDate,
        'To': this.endWeekDate,
        'ProductType': this.productType
      }
    } else if(this.tabResult.tabTitle === 'Custom') {
      var filterBody = {
        'From': moment(this.detail.get('fromDate').value).format('YYYY-MM-DDThh:mm:ss.sss'),
        'To': moment(this.detail.get('toDate').value).format('YYYY-MM-DD'),
        'ProductType': this.productType
      }
    }
    this.filter.push(filterBody);
    this.statsForCorporateDateVise$ = this.dashboardServiceData.fetchDashboardDataByCorporate(userInfo?.agencyId, branchId, this.filter[0]).pipe(
      tap(() => this.loader = true),
      map(res => {return res}),
      tap((res1: any) => {
        if(res1.items.length > 0 ) {
          let dateGrouped = {}
          res1.items.forEach((element1) => {
            if(!(!!element1.date))
            return
            dateGrouped[element1.date] = dateGrouped[element1.date] ?? 0;
            dateGrouped[element1.date] = {name : element1.corporateId, value: element1.sales};
          })

          this.corporateDateViseData = Object.keys(dateGrouped).map((x: string) => {
            return {name: x, series: [dateGrouped[x]]};
          })
          this.corporateDateViseData.sort((a, b) =>  {
            const newA = a.name.split('-').reverse().join('-');
            const newB = b.name.split('-').reverse().join('-');
            return +new Date(newA) - +new Date(newB)
          });
          this.noDateFoundMessage = false;
        } else {
          this.noDateFoundMessage = true;
          this.corporateDateViseData = [
            {
              "name": "No Data",
              "series": [
                {
                  "name": "No Data",
                  "value": 100
                }]
            }
          ];
        }
      },
      (error) => {
        this.noDateFoundMessage = true;
        this.corporateDateViseData = [
          {
            "name": "No Data",
            "series": [
              {
                "name": "No Data",
                "value": 100
              }]
          }
        ];
        // this.showDailog('Error', 'Something went wrong, Please contact your administrator.')
      }
      ), tap(() => this.loader = false)
    )
  }


  customFilterForDashboardData() {
    this.bookingStatsForOthers(this.userInfo, this.branchId);
    this.bookingStatsForOthersForHotel(this.userInfo, this.branchId);
    this.salesAndBookingFlightResult(this.userInfo, this.branchId);
    this.salesAndBookingResultByCity(this.userInfo, this.branchId);
    this.agentViseResultForFlight(this.userInfo, this.branchId);
    this.salesAndBookingResultByAirlineInFlight(this.userInfo, this.branchId);
    this.salesAndBookingResultByDomesticAndInternationalFlights(this.userInfo, this.branchId);
    this.salesAndBookingResultForHotel(this.userInfo, this.branchId);
    this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
    this.salesAndBookingResultByCityForHotel(this.userInfo, this.branchId);
    this.corporteViseResultForFlight(this.userInfo, this.branchId);
    this.corporateDateViseResult(this.userInfo, this.branchId);
  }

}
