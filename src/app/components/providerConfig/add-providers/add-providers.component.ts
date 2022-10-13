import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { URL } from 'url';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-add-providers',
  templateUrl: './add-providers.component.html',
  styleUrls: ['./add-providers.component.scss']
})
export class AddProvidersComponent implements OnInit {

  createProviderForm: FormGroup;

  loading: boolean = false;
  corporateId: any;
  branchId: any;
  public addContactEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public addPassengerEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public addPaymentEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public attachInfantEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public bookUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/
  public cancelEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public cancelUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public commitBookingEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public connectorMetadataUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public divideBookingEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public fareRulesUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public getBookingInStateEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public getItiniaryEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public mealUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public multiCityEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public priceUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public retrieveBookingEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public searchUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public seatAssignmentEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public seatMapUrl = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public seatMapsEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public sellSSREndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public simpleAvailiblityEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public ssrAvailiblityEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public tokenEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public tripSellEndPoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  public universalServiceEndpoint = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/;
  branchDetails: any;
  showPassword = false;
  corporates$: Observable<any>;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;

  corporateDetails:any;
  inputItemFormControl = new FormControl();
  corporateName: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly providerService: ProvidersService,
    private dailog: NbDialogService, private readonly branchService: BranchService,) { }

  ngOnInit(): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchService.fetchBranches(parentParam.id).subscribe((res: any) => {
      this.branchDetails = res?.items
    })

    this.createProviderFormFunction();
  }

  createProviderFormFunction () {
    this.createProviderForm = this.fb.group({
      providerId: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z/ -]+$')]],
      providerName: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      username: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      password: [null, [Validators.required]],
      agencyPCC: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z/ -]+$')]],
      authorizedBy: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z/ -]+$')]],
      targetBranch: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z/ -]+$')]],
      ticketingPcc: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z/ -]+$')]],
      universalServiceEndpoint: [null, [Validators.required, Validators.pattern(this.universalServiceEndpoint)]],
      supportedVersions: [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z/ -]+$')]],
      domain: [null, Validators.pattern('^[0-9a-zA-Z.,/: ]*$')],
      addContactEndPoint: [null, [Validators.required, Validators.pattern(this.addContactEndPoint)]],
      addPassengerEndPoint: [null, [Validators.required, Validators.pattern(this.addPassengerEndPoint)]],
      addPaymentEndPoint: [null, [Validators.required, Validators.pattern(this.addPaymentEndPoint)]],
      attachInfantEndPoint: [null, [Validators.required, Validators.pattern(this.attachInfantEndPoint)]],
      bookUrl: [null, [Validators.required, Validators.pattern(this.bookUrl)]],
      cancelEndPoint: [null, [Validators.required, Validators.pattern(this.cancelEndPoint)]],
      cancelUrl: [null, [Validators.required, Validators.pattern(this.cancelUrl)]],
      commitBookingEndPoint: [null, [Validators.required, Validators.pattern(this.commitBookingEndPoint)]],
      connectorMetadataUrl: [null, [Validators.required, Validators.pattern(this.connectorMetadataUrl)]],
      divideBookingEndPoint: [null, [Validators.required, Validators.pattern(this.divideBookingEndPoint)]],
      fareRulesUrl: [null, [Validators.required, Validators.pattern(this.fareRulesUrl)]],
      getBookingInStateEndPoint: [null, [Validators.required, Validators.pattern(this.getBookingInStateEndPoint)]],
      getItiniaryEndPoint: [null, [Validators.required, Validators.pattern(this.getItiniaryEndPoint)]],
      mealUrl: [null, [Validators.required, Validators.pattern(this.mealUrl)]],
      multiCityEndPoint: [null, [Validators.required, Validators.pattern(this.multiCityEndPoint)]],
      priceUrl: [null, [Validators.required, Validators.pattern(this.priceUrl)]],
      retrieveBookingEndPoint: [null, [Validators.required, Validators.pattern(this.retrieveBookingEndPoint)]],
      searchUrl: [null, [Validators.required, Validators.pattern(this.searchUrl)]],
      seatAssignmentEndPoint: [null, [Validators.required, Validators.pattern(this.seatAssignmentEndPoint)]],
      seatMapUrl: [null, [Validators.required, Validators.pattern(this.seatMapUrl)]],
      seatMapsEndPoint: [null, [Validators.required, Validators.pattern(this.seatMapsEndPoint)]],
      sellSSREndPoint: [null, [Validators.required, Validators.pattern(this.sellSSREndPoint)]],
      simpleAvailiblityEndPoint: [null, [Validators.required, Validators.pattern(this.simpleAvailiblityEndPoint)]],
      ssrAvailiblityEndPoint: [null, [Validators.required, Validators.pattern(this.ssrAvailiblityEndPoint)]],
      tokenEndPoint: [null, [Validators.required, Validators.pattern(this.tokenEndPoint)]],
      tripSellEndPoint: [null, [Validators.required, Validators.pattern(this.tripSellEndPoint)]]
    })
  }

  onBranchSelected($event) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchId = $event;
    fromEvent(this.corporate.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length > 2),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((res: any) => {
      this.providerService.getCorporate(res, this.branchId, parentParam).subscribe(res => this.corporateDetails = res)
    });
  }

  onCorporateSelected(event) {
    this.corporateId = event.target.value;
    console.log(this.corporateId)
  }

  markTouched() {
    this.createProviderForm.controls.addContactEndPoint.markAllAsTouched();
    this.createProviderForm.controls.addContactEndPoint.updateValueAndValidity();
  }

  markTouchedForaddPassengerEndPoint() {
    this.createProviderForm.controls.addPassengerEndPoint.markAllAsTouched();
    this.createProviderForm.controls.addPassengerEndPoint.updateValueAndValidity();
  }

  getPasswordType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  create() {
    this.loading = true;
    if(this.findInvalidControls().length > 0) {
      this.loading = false;
      return false
    } else {
      this.loading = false;
      const providerData = this.createProviderForm.value;
      const parentParam = this.activatedRoute.parent.snapshot.params;
      if(this.branchId === null || this.branchId === undefined) {
        this.branchId = '*';
      }
      if(this.inputItemFormControl.value === null || this.inputItemFormControl.value === undefined || this.inputItemFormControl.value === '*') {
        this.corporateId = '*';
      } else {
        let value = this.inputItemFormControl.value;
        let valueCorporate = this.corporateDetails.filter((corporate) => corporate.name === value);
        this.corporateId = valueCorporate[0]?.id;
      }
      this.providerService.createProviders(parentParam, this.branchId, this.corporateId, providerData)
      .subscribe((res) => {
        this.dailog.open(SuccessDialogComponent, {
          context: {
            title: 'Message',
            message: 'Provider created successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/providers`]);
        })
      },
      (error) => {
        console.log(error);
        this.dailog.open(SuccessDialogComponent, {
          context: {
            title: 'Message',
            message: 'Some error occurred, Please contact your administrator.'
          }
        })
      }
      )
    }
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/providers`]);
  }

  keyPressAlphaNumericWithCharacters(event) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z0-9-_]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.createProviderForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }


}
