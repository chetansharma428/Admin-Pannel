import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-edit-providers',
  templateUrl: './edit-providers.component.html',
  styleUrls: ['./edit-providers.component.scss']
})
export class EditProvidersComponent implements OnInit {

  queryParams: any;
  loading: boolean = false;
  corporateId: any;
  branchId: any;
  public addContactEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public addPassengerEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public addPaymentEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public attachInfantEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public bookUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public cancelEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public cancelUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public commitBookingEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public connectorMetadataUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public divideBookingEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public fareRulesUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public getBookingInStateEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public getItiniaryEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public mealUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public multiCityEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public priceUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public retrieveBookingEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public searchUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public seatAssignmentEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public seatMapUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public seatMapsEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public sellSSREndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public simpleAvailiblityEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public ssrAvailiblityEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public tokenEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public tripSellEndPoint = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  public password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  branchDetails: any;

  createProviderForm: FormGroup;
  providerData: any;
  idsData: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly fb: FormBuilder, private readonly branchStatusService: BranchSavingService,
    private readonly storageService: StorageService,) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })

    this.idsData = this.storageService.getItems('dataForChannels');
    this.providerData = this.branchStatusService.providersData;
    if(!this.providerData) {
      const parentParam = this.activatedRoute.parent.snapshot.params;
      this.router.navigate([`${parentParam.id}/providers`]);
    }
    this.createProviderFormFunction(this.providerData);
  }

  createProviderFormFunction (res) {
    this.createProviderForm = this.fb.group({
      providerId: [res?.providerId],
      providerName: [res?.providerName],
      username: [res?.username],
      password: [res?.password],
      agencyPCC: [res?.agencyPCC],
      authorizedBy: [res?.authorizedBy],
      targetBranch: [res?.targetBranch],
      ticketingPcc: [res?.ticketingPcc],
      universalServiceEndpoint: [res?.universalServiceEndpoint],
      supportedVersions: [res?.supportedVersions],
      domain: [res?.domain],
      branchId: [this.idsData.branchId],
      addContactEndPoint: [res?.addContactEndPoint],
      addPassengerEndPoint: [res?.addPassengerEndPoint],
      addPaymentEndPoint: [res?.addPaymentEndPoint],
      attachInfantEndPoint: [res?.attachInfantEndPoint],
      bookUrl: [res?.bookUrl],
      cancelEndPoint: [res?.cancelEndPoint],
      cancelUrl: [res?.cancelUrl],
      commitBookingEndPoint: [res?.commitBookingEndPoint],
      connectorMetadataUrl: [res?.connectorMetadataUrl],
      divideBookingEndPoint: [res?.divideBookingEndPoint],
      fareRulesUrl: [res?.fareRulesUrl],
      getBookingInStateEndPoint: [res?.getBookingInStateEndPoint],
      getItiniaryEndPoint: [res?.getItiniaryEndPoint],
      mealUrl: [res?.mealUrl],
      multiCityEndPoint: [res?.multiCityEndPoint],
      priceUrl: [res?.priceUrl],
      retrieveBookingEndPoint: [res?.retrieveBookingEndPoint],
      searchUrl: [res?.searchUrl],
      seatAssignmentEndPoint: [res?.seatAssignmentEndPoint],
      seatMapUrl: [res?.seatMapUrl],
      seatMapsEndPoint: [res?.seatMapsEndPoint],
      sellSSREndPoint: [res?.sellSSREndPoint],
      simpleAvailiblityEndPoint: [res?.simpleAvailiblityEndPoint],
      ssrAvailiblityEndPoint: [res?.ssrAvailiblityEndPoint],
      tokenEndPoint: [res?.tokenEndPoint],
      tripSellEndPoint: [res?.tripSellEndPoint]
    })
    if(this.queryParams) {
      this.createProviderForm.disable();
    }
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/providers`]);
  }

}
