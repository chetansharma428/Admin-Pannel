import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PolicyService } from '../../../lib/services/corporate-service/policy/policy.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-update-policy',
  templateUrl: './update-policy.component.html',
  styleUrls: ['./update-policy.component.scss']
})
export class UpdatePolicyComponent implements OnInit {
  productType: any;
  createPolicyForm: FormGroup;
  bookingAndEligibility: FormGroup;
  fareTypeForm: FormGroup;
  amountperSegment: FormGroup;
  bookingWindow: FormGroup;
  cabinType: FormGroup;
  seatInfo: FormGroup;
  mealInfo: FormGroup
  loading: boolean = false;

  approvalType = ['Always','Never','OutOfPolicy'];
  // tripType = ['Can Book Flights For Any Domestic Route', 'Can Book Flights For Any International Route'];
  booking: boolean;
  fareValue: boolean;
  // fareType = ['Corporate Fare', 'Retail Fare'];
  Rules: Array<any> = []
  profileId: any;
  convienence: boolean;
  queryParams: any;

  policyProfile$: Observable<any>;
  cabinTypeValues: any;
  loadingPageData: boolean = false;
  constructor(private readonly storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly policyService: PolicyService,
    private readonly dialog: NbDialogService,
    private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadingPageData = true;
    this.profileId = this.route.snapshot.paramMap.get('id');
    this.productType = this.route.snapshot.paramMap.get('option');
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.policyProfile$ = this.policyService.fetchPolicybyId(parentParam.id, parentParam.corpId, this.profileId).pipe(
      map(res => { return res }),
      tap((res) => this.policyCreationForm(res))
    );
    this.route.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this.loadingPageData = false;
  }

  policyCreationForm(data) {
    let booking = [];
    data.rules?.forEach(element => {
      if(element.attributeName === "TripType" || element.attributeName === "employeeeligibility") {
        booking.push(element)
      }
    });
    let bookingValues = booking[0]?.value?.textValue?.toLowerCase()?.split(',');
    bookingValues = bookingValues?.map(element => {
      return element.trim()
    });

    if(booking.length > 0) {
      this.booking = true;
    }

    this.bookingAndEligibility = this.fb.group({
      'AttributeName': ['TripType'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'TextValue': [bookingValues]
      })
    });


    ///Fare Setting;
    let fareoption = [];
    data.rules?.forEach(element => {
      if(element?.attributeName === 'FareType' || element?.attributeName === 'faretype') {
        if(element?.value.textValue) {
          fareoption.push(element);
        }
      }
    });

    let fareOptionValues = fareoption[0]?.value?.textValue?.toLowerCase()?.split(',');
    fareOptionValues = fareOptionValues?.map(element => {
      return element.trim()
    });
    this.fareTypeForm = this.fb.group({
      'AttributeName': ['FareType'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'TextValue': [fareOptionValues]
      })
    });

    let amountPerSegmentValue;
    data.rules?.forEach(element => {
      if(element?.attributeName === 'perPassengerPerSegment' || element?.attributeName === 'maximumpriceperpersonpersegment') {
        if(element?.value.numericValue) {
          amountPerSegmentValue = element.value.numericValue;
        }
      }
    });
    this.amountperSegment = this.fb.group({
      'AttributeName': ['perPassengerPerSegment'],
      'ValueType': ['Numeric'],
      'Value': this.fb.group({
        'NumericValue': [amountPerSegmentValue]
      })
    });

    //Booking Window
    let bookingWindowValue;
    data.rules?.forEach(element => {
      if(element?.attributeName === 'advancebookingwindow') {
        if(element?.value.numericValue) {
          bookingWindowValue = element.value.numericValue;
        }
      }
    });
    this.bookingWindow = this.fb.group({
      'AttributeName': ['advancebookingwindow'],
      'ValueType': ['Numeric'],
      'Value': this.fb.group({
        'NumericValue': [bookingWindowValue]
      })
    });

    if(fareoption.length > 0 || amountPerSegmentValue !== undefined || bookingWindowValue !== undefined) {
      this.fareValue = true;
    }

    // comfort and convinence
    // this.convienence = true;
    let cabinType = [];
    data.rules?.forEach(element => {
      if(element?.attributeName === 'cabintype') {
        if(element?.value.textValue) {
          cabinType.push(element);
        }
      }
    });
    this.cabinTypeValues = cabinType[0]?.value?.textValue?.split(',');
    this.cabinTypeValues = this.cabinTypeValues?.map(element => {
      return element.trim()
    });

    this.cabinType = this.fb.group({
      'AttributeName': ['cabintype'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'textValue': [this.cabinTypeValues]
      })
    });

    //Seat Details
    let seatType = [];
    data.rules?.forEach(element => {
      if(element?.attributeName === 'allowedPaidSeatForFare') {
        if(element?.value.textValue) {
          seatType.push(element);
        }
      }
    });
    let seatTypeValues = seatType[0]?.value?.textValue?.split(',');
    seatTypeValues = seatTypeValues?.map(element => {
      return element.trim()
    });
    this.seatInfo = this.fb.group({
      'AttributeName': ['allowedPaidSeatForFare'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'textValue': [seatTypeValues]
      })
    });

    //meal Details
    let mealType = []
    data.rules?.forEach(element => {
      if(element?.attributeName === 'allowedPaidMealForFare') {
        if(element?.value.textValue) {
          mealType.push(element);
        }
      }
    });
    let mealTypeValues = mealType[0]?.value?.textValue?.split(',');
    mealTypeValues = mealTypeValues?.map(element => {
      return element.trim()
    });

    this.mealInfo = this.fb.group({
      'AttributeName': ['allowedPaidMealForFare'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'textValue': [mealTypeValues]
      })
    });

    if(cabinType.length > 0 || seatType.length > 0 || mealType.length > 0) {
      this.convienence = true;
    }

    this.createPolicyForm = this.fb.group({
      Name: [data.name, Validators.required],
      ApprovalType: [data.approvalType, Validators.required],
      ProductType: [this.productType, [Validators.required]],
      Description: [data.description, Validators.required],
      Rules: []
    });

    if(this.queryParams) {
      this.createPolicyForm.disable();
      this.bookingAndEligibility.disable();
      this.mealInfo.disable();
      this.seatInfo.disable();
      this.cabinType.disable();
      this.bookingWindow.disable();
      this.amountperSegment.disable();
      this.fareTypeForm.disable();
    }
  }

  keyPressAlphaWithCharacters(event) {
    var inp = String.fromCharCode(event.keyCode);
    // Allow alpahbets, space, underscore
    if (/[a-zA-Z_]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressNumberWithCharacters(event) {
    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  updatePolicyFunction() {
    this.loading = true;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    let bookingFormValues = this.bookingAndEligibility.value;
    let amountPerSegmentValues = this.amountperSegment.value;
    let fareTypeFormValues = this.fareTypeForm.value;
    let bookingWindowValues = this.bookingWindow.value;
    let cabinTypeValues = this.cabinType.value;
    let seatInfoValues = this.seatInfo.value;
    let mealInfoValues = this.mealInfo.value;

    bookingFormValues.Value.TextValue = bookingFormValues.Value?.TextValue?.map(x => x).join(",");
    fareTypeFormValues.Value.TextValue = fareTypeFormValues.Value?.TextValue?.map(x => x).join(",");
    cabinTypeValues.Value.textValue = cabinTypeValues.Value?.textValue?.map(x => x).join(",");
    seatInfoValues.Value.textValue = seatInfoValues.Value?.textValue?.map(x => x).join(",");
    mealInfoValues.Value.textValue = mealInfoValues.Value?.textValue?.map(x => x).join(",");
      if(bookingFormValues.Value.TextValue != undefined) {
        this.Rules.push(this.bookingAndEligibility.value);
      }
      if(amountPerSegmentValues.Value.NumericValue != '') {
        this.Rules.push(this.amountperSegment.value);
      }
      if(fareTypeFormValues.Value.TextValue != undefined) {
        this.Rules.push(this.fareTypeForm.value);
      }
      if(bookingWindowValues.Value.NumericValue != '') {
        this.Rules.push(this.bookingWindow.value);
      }
      if(cabinTypeValues.Value.textValue != undefined) {
        this.Rules.push(this.cabinType.value);
      }
      if(seatInfoValues.Value.textValue != undefined) {
        this.Rules.push(this.seatInfo.value);
      }
      if(mealInfoValues.Value.textValue != undefined) {
        this.Rules.push(this.mealInfo.value);
      }
    const data = this.createPolicyForm.value;
    data['Rules'] = this.Rules;
    if(this.createPolicyForm.invalid) {
      this.loading = false;
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Warning',
          message: 'Please fill the basic details !'
        }
      })
    } else {
      this.policyService.updatePolicyApi(parentParam.id, parentParam.corpId, data, this.profileId).subscribe((res) => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Policy Message',
            message: 'Policy Updated Successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/policy`]);
        })
      },
      (error) => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Policy Message',
            message: 'error occurred. Contact administrator.!'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/policy`]);
        })
      })
    }

  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/policy`]);
  }

  toggleFunction(status) {
    let statusOfBooking = status.target.checked;
    if(statusOfBooking) {
      this.booking = true;
    } else {
      this.booking = false;
    }
  }

  toggleFareFunction(status) {
    let statusOfFare = status.target.checked;
    if(statusOfFare) {
      this.fareValue = true;
    } else {
      this.fareValue = false;
    }
  }

  toggleConvienceFunction(status) {
    let statusOfFare = status.target.checked;
    if(statusOfFare) {
      this.convienence = true;
    } else {
      this.convienence = false;
    }
  }

}
