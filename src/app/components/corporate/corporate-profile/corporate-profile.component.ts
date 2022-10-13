import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CorporateService } from '../../../lib/services/corporate-service/corporate/corporate.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-corporate-profile',
  templateUrl: './corporate-profile.component.html',
  styleUrls: ['./corporate-profile.component.scss']
})
export class CorporateProfileComponent implements OnInit {
  @ViewChild('flight') flight;
  @ViewChild('autoInput') input;
  @ViewChild('autoInput1') input1;

  filteredOptions$: Observable<string[]>;
  paymentOptions: string[];
  paymentCardsForAdd: Array<any> = [];
  paymentValues = [];

  checked: boolean = false;
  corporateProfileData: any;
  corporateRegistration: FormGroup;
  isDisabled: boolean = true;
  corporateProfile$: Observable<any>;

  flights = [];
  hotels = [];
  queryParams: any;
  view: boolean;
  branchId: any;
  loadingPageData: boolean = false;
  loading: boolean = false;
  loadingDeactivate: boolean = false;
  loadingActivate: boolean = false;
  userInfo: any;
  constructor(private fb: FormBuilder, private readonly activatedRoute: ActivatedRoute,
    private readonly corporateService: CorporateService, private readonly router: Router,
    private readonly dialog: NbDialogService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.loadingPageData = true;
    this.paymentOptions = ['Direct', 'CompanyAccount'];
    this.userInfo = this.storageService.getItems('userInfo');
    const paramMaps = this.activatedRoute.snapshot.params;
    const parentParam = this.activatedRoute.parent.snapshot.params;

    this.activatedRoute.queryParams.subscribe(params => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    });

    if(!this.queryParams?.mode) {
      this.view = true;
    }
    let params = {
      id: parentParam.id || this.queryParams.agencyId,
      corpId: paramMaps.corporateId || this.queryParams.corporteId
    }
    this.branchId = this.storageService.getItems('branchDetail')?.id;
    this.corporateProfile$ = this.corporateService.fetchCorporatedata(params, this.branchId).pipe(
      map(res => { return res }),
      tap((res) => this.corporateForm(res)));
      this.loadingPageData = false;
  }

  corporateForm(data) {
    this.corporateRegistration = this.fb.group({
      "type": [data.type || null],
      "agreementValidityFrom": [data.agreementValidityFrom || null],
      "agreementValidityTo": [data.agreementValidityTo || null],
      "associatedOrgType": [data.associatedOrgType || null],
      "departments": [data.departments || null],
      "designations": [data.designations || null],
      "projects": [data.projects || null],
      "id": [data.id || null, [Validators.required]],
      "name": [data.name, [Validators.required]],
      "emailId": [data.emailId || null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      "creatorEmailId": [data.creatorEmailId || null, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')],
      "approvers": [data.approvers || null],
      "parentId": [data.parentId || null],
      "associatedOrgId": [data.associatedOrgId || null],
      "panNo": [data.panNo || null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]{10}$')]],
      "tanNo": [data.tanNo || null],
      "walletId": [data.walletId || null],

      "accountLedgerCodes": this.fb.array([]),

      "registeredAddress": this.fb.group({
        "addressLine1": [data.registeredAddress.addressLine1 || null, [Validators.required]],
        "addressLine2": [data.registeredAddress.addressLine2 || null],
        "addressLine3": [data.registeredAddress.addressLine3 || null],
        "country": [data.registeredAddress.country || null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [data.registeredAddress.state || null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [data.registeredAddress.city || null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [data.registeredAddress.zip || null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        "mobileNo": [data.registeredAddress.mobileNo || null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [data.registeredAddress.phoneNo1 || null, [Validators.pattern('^[0-9]*$')]],
        "phoneNo2": [data.registeredAddress.phoneNo2 || null, [Validators.pattern('^[0-9]*$')]],
        "faxNo": [data.registeredAddress.faxNo || null]
      }),

      "communicationAddress": this.fb.group({
        "addressLine1": [data.communicationAddress.addressLine1 || null, [Validators.required]],
        "addressLine2": [data.communicationAddress.addressLine2 || null],
        "addressLine3": [data.communicationAddress.addressLine3 || null],
        "country": [data.communicationAddress.country || null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [data.communicationAddress.state || null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [data.communicationAddress.city || null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [data.communicationAddress.zip || null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        "mobileNo": [data.communicationAddress.mobileNo || null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [data.communicationAddress.phoneNo1 || null, [Validators.pattern('^[0-9]*$')]],
        "phoneNo2": [data.communicationAddress.phoneNo2 || null, [Validators.pattern('^[0-9]*$')]],
        "faxNo": [data.communicationAddress.faxNo || null]
      }),

      "pointOfContact": this.fb.group({
        "title": [data.pointOfContact.title || null],
        "firstName": [data.pointOfContact.firstName || null, [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        "lastName": [data.pointOfContact.lastName || null, [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
        "emailId": [data.pointOfContact.emailId || null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
        "mobileNo": [data.pointOfContact.mobileNo || null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [data.pointOfContact.phoneNo1 || null, [Validators.pattern('^[0-9]*$')]],
        "phoneNo2": [data.pointOfContact.phoneNo2 || null, [Validators.pattern('^[0-9]*$')]],
        "faxNo": [data.pointOfContact.faxNo || null],
        "domain": [data.pointOfContact.domain || null, Validators.pattern('^[0-9a-zA-Z.,/: ]*$')]
      }),

      "verifiedDomains": [data.verifiedDomains || null, Validators.pattern('^[0-9a-zA-Z.,/: ]*$')],

      "gsTs": this.fb.array([]),

      "bookingThreshold": this.fb.group({
        "flight": [data?.bookingThreshold?.flight || null, [Validators.pattern('^[0-9]*$'), Validators.max(100)]],
        "hotel": [data?.bookingThreshold?.hotel || null, [Validators.pattern('^[0-9]*$'), Validators.max(100)]]
      }),

      "isMissedSavingEnabled": [data.isMissedSavingEnabled || null],
      "missedSavingMaxAlternatives": [data.missedSavingMaxAlternatives || null, [Validators.pattern('^[0-9]*$')]],
      "missedSavingMaxOffsetMins":[data.missedSavingMaxOffsetMins || null, [Validators.pattern('^[0-9]*$')]],
      "missedSavingReasons": [data.missedSavingReasons || null, Validators.pattern('^[0-9a-zA-Z-., ]*$')],

      "paymentOptionConfiguration": this.fb.group({
        "flight": [null],
        "hotel": [null]
      }),

      "isActive": [data.isActive || null]
    });

    this.flights =  data.paymentOptionConfiguration?.flight;
    this.hotels =  data.paymentOptionConfiguration?.hotel;

    const control = this.corporateRegistration.get('gsTs') as FormArray;
    data.gsTs.forEach(element => {
      control.push(this.fb.group({
        "gstNo": [element.gstNo || null, [Validators.pattern('^[a-zA-Z0-9]{15}$')]],
        "gstRegisteredName": [element.gstRegisteredName || null],
        "emailId": [element.emailId || null, [Validators.required]],
        "address": this.fb.group({
          "addressLine1": [element.address.addressLine1 || null],
          "addressLine2": [element.address.addressLine2 || null],
          "addressLine3": [element.address.addressLine3 || null],
          "country": [element.address.country || null],
          "state": [element.address.state || null],
          "city": [element.address.city || null],
          "zip": [element.address.zip || null, [Validators.pattern('^[0-9]{6}$')]],
          "mobileNo": [element.address.mobileNo || null, [Validators.pattern('^[0-9]{10}$')]],
          "phoneNo1": [element.address.phoneNo1 || null, [Validators.pattern('^[0-9]*$')]],
          "phoneNo2": [element.address.phoneNo2 || null, [Validators.pattern('^[0-9]*$')]],
          "faxNo": [element.address.faxNo|| null]
        })
      }));
    });

    const accountLedgerCodes = this.corporateRegistration.get('accountLedgerCodes') as FormArray;
    data.accountLedgerCodes.forEach(element => {
      accountLedgerCodes.push(this.fb.group({
        "code": [element.code || null],
        "description": [element.description || null],
        "isActive": [element.isActive || false]
      }));
    });

    if (this.queryParams) {
      this.corporateRegistration.disable();
    }
  }

  back() {
    this.userInfo = this.storageService.getItems('userInfo');
    if(this.userInfo?.userType === 'corporateemployee') {
      this.router.navigate(['/dashboard'])
    } else {
      const parentParams = this.activatedRoute.parent.snapshot.params;
      const id = parentParams.id || this.queryParams.agencyId;
      this.router.navigate([`${id}/corporate`]);
    }
  }

  corporateProfile() {
    const paramMaps = this.activatedRoute.snapshot.params;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${paramMaps.corporateId}/employee-profile`]);
  }

  corporateEmployees() {
    const paramMaps = this.activatedRoute.snapshot.params;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${paramMaps.corporateId}/employee/list`]);
  }

  corporateGroups() {
    const paramMaps = this.activatedRoute.snapshot.params;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${paramMaps.corporateId}/groups`]);
  }

  updateCorporate() {
    this.loading = true;
    if (this.findInvalidControls().length > 0) {
      this.loading = false;
      let data = this.findInvalidControls().toString();
      let message = "Please fill the"+ " " + data + " " +"mandatory field";
      // console.log(message);
      this.showDialog('Error', message);
      // console.log(data);
      return false;
    } else {
      const formValue = this.corporateRegistration.value;
      if (Array.isArray(formValue.verifiedDomains)) {
      } else if (formValue.verifiedDomains && formValue.verifiedDomains.includes(',') && !Array.isArray(formValue.verifiedDomains)) {
        formValue.verifiedDomains = formValue.verifiedDomains.split(',').map(item => item.trim());
      } else {
        const domain = [];
        domain.push(formValue.verifiedDomains);
        formValue.verifiedDomains = domain;
      }

      if (Array.isArray(formValue.missedSavingReasons)) {
      } else if (formValue.missedSavingReasons && formValue.missedSavingReasons.includes(',') && !Array.isArray(formValue.missedSavingReasons)) {
        formValue.missedSavingReasons = formValue.missedSavingReasons.split(',').map(item => item.trim());
      } else {
        const savingReason = [];
        savingReason.push(formValue.missedSavingReasons);
        formValue.missedSavingReasons = savingReason;
      }

      if (Array.isArray(formValue.paymentOptionConfiguration.flight)) {
      } else if (this.flights) {
        formValue.paymentOptionConfiguration.flight = this.flights;
        this.flights = [];
      }

      if (Array.isArray(formValue.paymentOptionConfiguration.hotel)) {
      } else if (this.hotels) {
        formValue.paymentOptionConfiguration.hotel = this.hotels;
        this.hotels = [];
      }

      this.corporateService.updateCorporate(formValue).subscribe(res => {
        this.loading = false;
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Success',
              message: 'Corporate has been Updated. !'
            }
          }).onClose.subscribe((res) => {
            this.router.navigate([`${formValue.parentId}/corporate`]);
          })
      }, error => {
        this.loading = false;
        this.showDialog('Error', 'Please contact the Administrator.');
      });
      }


  }

  addGst() {
    const control = this.corporateRegistration.get('gsTs') as FormArray;
    control.push(this.fb.group({
      "gstNo": ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{15}$')]],
      "gstRegisteredName": ['', [Validators.required]],
      "emailId": ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      "address": this.fb.group({
        "addressLine1": ['', [Validators.required]],
        "addressLine2": [''],
        "addressLine3": [''],
        "country": ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        "mobileNo": ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": ['', [Validators.pattern('^[0-9]*$')]],
        "phoneNo2": ['', [Validators.pattern('^[0-9]*$')]],
        "faxNo": ['']
      })
    }));
  }

  deleteGst(gstIndex: number) {
    const control = this.corporateRegistration.get('gsTs') as FormArray;
    control.removeAt(gstIndex)
  };

  addAccountledgercodes() {
    const accountLedgerCodes = this.corporateRegistration.get('accountLedgerCodes') as FormArray;
    accountLedgerCodes.push(this.fb.group({
      "code": [''],
      "description": [''],
      "isActive": [false]
    }));
  }

  deleteLedgerCode(ledgerCode: number) {
    const control = this.corporateRegistration.get('accountLedgerCodes') as FormArray;
    control.removeAt(ledgerCode);
  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    });
  }

  //functions for autocomplete
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.paymentOptions.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString)),
    );
  }

  onChange(inputVal) {
    this.filteredOptions$ = this.getFilteredOptions(this[inputVal].nativeElement.value);
  }

  onSelectionChange($event, val) {
    if (!this[val].includes($event)) {
      this[val].push($event);
    }
    this.input.nativeElement.value = '';
    this.input1.nativeElement.value = '';
  }

  onTagRemove(tagToRemove: NbTagComponent, inputVal): void {
    this[inputVal] = this[inputVal].filter(t => t !== tagToRemove.text);
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.corporateRegistration.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    console.log(invalid);
    return invalid;
  }

  activateCorporate() {
    this.loadingActivate = true;
    this.corporateService.activate(this.corporateRegistration.value).subscribe(res => {
      this.loadingActivate = false;
      this.showDialog('Success', 'Corporate Activated Successfully');
      // this.router.navigate([`${this.corporateRegistration.value.parentId}/corporate`]);
    });
  }

  deactivateCorporate() {
    this.loadingDeactivate = true;
    this.corporateService.deactivate(this.corporateRegistration.value).subscribe(res => {
      this.loadingDeactivate = false;
      this.showDialog('Success', 'Corporate Deactivated Successfully');
      this.router.navigate([`${this.corporateRegistration.value.parentId}/corporate`]);
    });
  }
}
