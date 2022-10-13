import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CorporateService } from '../../../lib/services/corporate-service/corporate/corporate.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-corporate-register',
  templateUrl: './corporate-register.component.html',
  styleUrls: ['./corporate-register.component.scss']
})
export class CorporateRegisterComponent implements OnInit {
  @ViewChild('flight') flight;
  @ViewChild('autoInput') input;
  @ViewChild('autoInput1') input1;

  paymentOptions: string[];
  paymentValues = [];
  filteredOptions$: Observable<string[]>;
  paymentCardsForAdd: Array<any> = [];
  flights = [];
  hotels = [];
  minValueFrom = new Date();
  minValueTo = new Date();

  corporateRegistration: FormGroup;
  public checked: boolean = false;

  loading: boolean = false;
  constructor(private readonly fb: FormBuilder,
    private readonly corporateService: CorporateService,
    private readonly storageService: StorageService,
    private readonly dialog: NbDialogService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.paymentOptions = ['Direct', 'CompanyAccount'];
    this.createCorporateForm();
  };

  dateChange($event) {
    this.minValueTo = $event;
  }

  createCorporateForm() {
    this.corporateRegistration = this.fb.group({
      "type": ['Corporate'],
      "agreementValidityFrom": [],
      "agreementValidityTo": [],
      "id": [null, [Validators.required, Validators.pattern('^[0-9a-zA-Z_]*$')]],
      "name": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      "emailId": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      "parentId": [this.storageService.getItems('loggedinUserdetails')?.userDetails?.ParentId],
      "panNo": [null, [Validators.required, Validators.pattern('^[A-Za-z]{5}[0-9]{4}[A-Za-z]$')]],
      "tanNo": [null],
      "associatedOrgType": "Branch",
      "contactNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      "creatorEmailId": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      "associatedOrgId": [this.storageService.getItems('branchDetail')?.name],

      "pointOfContact": this.fb.group({
        "title": [null, [Validators.required]],
        "emailId": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "firstName": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "lastName": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "domain": [null, Validators.pattern('^[0-9a-zA-Z.,/: ]*$')],
      }),

      "verifiedDomains": ['', Validators.pattern('^[0-9a-zA-Z.,/: ]*$')],

      "registeredAddress": this.fb.group({
        "addressLine1": [null, [Validators.required]],
        "addressLine2": [null],
        "addressLine3": [null],
        "country": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        "emailId": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
        "alternateEmailId": [null, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [null, [Validators.pattern('^[0-9]{10}$')]],
        "phoneNo2": [null, [Validators.pattern('^[0-9]{10}$')]],
        "faxNo": [null],
      }),

      "communicationAddress": this.fb.group({
        "addressLine1": [null, [Validators.required]],
        "addressLine2": [null],
        "addressLine3": [null],
        "country": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        "emailId": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
        "alternateEmailId": [null, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [null, [Validators.pattern('^[0-9]{10}$')]],
        "phoneNo2": [null, [Validators.pattern('^[0-9]{10}$')]],
        "faxNo": [null],
      }),

      "gsTs": this.fb.array([]),

      "bookingThreshold": this.fb.group({
        "flight": [null, [Validators.pattern('^[0-9]*$'), Validators.max(100)]],
        "hotel": [null, [Validators.pattern('^[0-9]*$'), Validators.max(100)]]
      }),

      "isMissedSavingEnabled": [false],
      "missedSavingMaxAlternatives": [null, [Validators.pattern('^[0-9]*$')]],
      "missedSavingMaxOffsetMins":[null, [Validators.pattern('^[0-9]*$')]],
      "missedSavingReasons": ['', Validators.pattern('^[0-9a-zA-Z-., ]*$')],

      "paymentOptionConfiguration": this.fb.group({
        "flight": [null],
        "hotel": [null]
      })

    });

    const gsTs = this.corporateRegistration.get('gsTs') as FormArray;
    gsTs.push(this.fb.group({
      "gstNo": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]{15}$')]],
      "gstRegisteredName": [null, [Validators.required]],
      "emailId": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      "address": this.fb.group({
        "addressLine1": [null, [Validators.required]],
        "addressLine2": [null],
        "addressLine3": [null],
        "country": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        "emailId": [null, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
        "alternateEmailId": [null, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [null, [Validators.pattern('^[0-9]{10}$')]],
        "phoneNo2": [null, [Validators.pattern('^[0-9]{10}$')]],
        "faxNo": [null],
      }),
    }));
  };

  register() {
    this.loading = true;
    if (this.findInvalidControls().length > 0) {
      this.loading = false;
      return false;
    } else {
      const formValue = this.corporateRegistration.value;
      if (formValue.verifiedDomains && formValue.verifiedDomains.includes(',') && !Array.isArray(formValue.verifiedDomains)) {
        formValue.verifiedDomains = formValue.verifiedDomains.split(',').map(item => item.trim());
      } else {
        const values = [];
        values.push(formValue.verifiedDomains);
        formValue.verifiedDomains = values;
      }

      if (formValue.missedSavingReasons && formValue.missedSavingReasons.includes(',') && !Array.isArray(formValue.missedSavingReasons)) {
        formValue.missedSavingReasons = formValue.missedSavingReasons.split(',').map(item => item.trim());
      } else {
        const values = [];
        values.push(formValue.missedSavingReasons);
        formValue.missedSavingReasons = values;
      }


      if (this.flights) {
        formValue.paymentOptionConfiguration.flight = this.flights;
        this.flights = [];
      }

      if (this.hotels) {
        formValue.paymentOptionConfiguration.hotel = this.hotels;
        this.hotels = [];
      }

      formValue.associatedOrgId = this.storageService.getItems('branchDetail')?.id;

      this.corporateService.createCorporate(formValue).subscribe(res => {
        this.loading = false;
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Success',
              message: 'Corporate has been Created !'
            }
          }).onClose.subscribe((res) => {
            this.router.navigate([`${formValue.parentId}/corporate`]);
          })
      }, error => {
        if (error && error.error && error.error.message && error.error.message.includes('Corporate created successfully')) {
          this.loading = false;
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Success',
              message: 'Corporate has been Created !'
            }
          }).onClose.subscribe((res) => {
            this.router.navigate([`${formValue.parentId}/corporate`]);
          })
        } else {
          this.loading = false;
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Error',
              message: 'Some error occurred, Please contact your administrator.'
            }
          })
        }
      });
      }

  };

  back() {
    const parentParams = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParams.id}/corporate`]);
  }

  onCheck(checked: boolean) {
    this.checked = checked;
    const address = this.corporateRegistration.value.registeredAddress;
    if (this.checked) {
      this.corporateRegistration.controls.communicationAddress.setValue({
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        addressLine3: address.addressLine3,
        country: address.country,
        state: address.state,
        city: address.city,
        zip: address.zip,
        emailId: address.emailId,
        alternateEmailId: address.alternateEmailId,
        mobileNo: address.mobileNo,
        phoneNo1: address.phoneNo1,
        phoneNo2: address.phoneNo2,
        faxNo: address.faxNo
      });
    } else {
      this.corporateRegistration.controls.communicationAddress.setValue({
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        emailId: '',
        alternateEmailId: '',
        mobileNo: '',
        phoneNo1: '',
        phoneNo2: '',
        faxNo: ''
      });
    }
  };

  /**function to add multiple GSTs*/
  addGst() {
    const control = this.corporateRegistration.get('gsTs') as FormArray;
    control.push(this.fb.group({
      "gstNo": [''],
      "gstRegisteredName": [''],
      "emailId": [''],
      "address": this.fb.group({
        "addressLine1": [''],
        "addressLine2": [''],
        "addressLine3": [''],
        "country": [''],
        "state": [''],
        "city": [''],
        "zip": [''],
        "mobileNo": [''],
        "phoneNo1": [''],
        "phoneNo2": [''],
        "faxNo": ['']
      })
    }));
  };

  /**function to delete GST**/
  deleteGst(gstIndex: number) {
    const control = this.corporateRegistration.get('gsTs') as FormArray;
    control.removeAt(gstIndex);
  };

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

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.paymentCardsForAdd.push(tagToRemove.text);
    this.filteredOptions$ = of(this.paymentCardsForAdd);
    this.paymentValues = this.paymentValues.filter(t => t !== tagToRemove.text);
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
}

