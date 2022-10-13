import { map } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { PolicyService } from '../../../lib/services/corporate-service/policy/policy.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-create-policy',
  templateUrl: './create-policy.component.html',
  styleUrls: ['./create-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePolicyComponent implements OnInit {

  productType: any;
  createPolicyForm: FormGroup;
  bookingAndEligibility: FormGroup;
  fareTypeForm: FormGroup;
  amountperSegment: FormGroup;
  bookingWindow: FormGroup;
  cabinType: FormGroup;
  seatInfo: FormGroup;
  mealInfo: FormGroup;
  loading: boolean = false;

  approvalType = ['Always','Never', 'OutOfPolicy'];
  tripType = ['Can Book Flights For Any Domestic Route', 'Can Book Flights For Any International Route'];
  booking: boolean;
  fareValue: boolean;
  convienence: boolean;
  fareType = ['Corporate Fare', 'Retail Fare'];
  Rules: Array<any> = [];
  productTypeOptions= ['Flight','Hotel'];

  constructor(private readonly storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly policyService: PolicyService,
    private readonly dialog: NbDialogService, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.productType = this.route.snapshot.paramMap.get('option');
    this.policyCreationForm();
  }


  policyCreationForm() {
    this.bookingAndEligibility = this.fb.group({
      'AttributeName': ['TripType'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'TextValue': null
      })
    });

    this.fareTypeForm = this.fb.group({
      'AttributeName': ['FareType'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'TextValue': null
      })
    });

    this.amountperSegment = this.fb.group({
      'AttributeName': ['perPassengerPerSegment'],
      'ValueType': ['Numeric'],
      'Value': this.fb.group({
        'NumericValue': ['']
      })
    });

    this.bookingWindow = this.fb.group({
      'AttributeName': ['advancebookingwindow'],
      'ValueType': ['Numeric'],
      'Value': this.fb.group({
        'NumericValue': ['']
      })
    });

    this.cabinType = this.fb.group({
      'AttributeName': ['cabintype'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'textValue': null
      })
    });

    this.seatInfo = this.fb.group({
      'AttributeName': ['allowedPaidSeatForFare'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'textValue': null
      })
    });

    this.mealInfo = this.fb.group({
      'AttributeName': ['allowedPaidMealForFare'],
      'ValueType': ['Text'],
      'Value': this.fb.group({
        'textValue': null
      })
    });

    this.createPolicyForm = this.fb.group({
      Name: ['', Validators.required],
      ApprovalType: ['', Validators.required],
      ProductType: [this.productType, [Validators.required]],
      Description: ['', Validators.required],
      Rules: []
    });

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


  createPolicyFunction() {
    this.loading = true;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    let bookingFormValues = this.bookingAndEligibility.value;
    let amountPerSegmentValues = this.amountperSegment.value;
    let fareTypeFormValues = this.fareTypeForm.value;
    let bookingWindowValues = this.bookingWindow.value;
    let cabinTypeValues = this.cabinType.value;
    let seatInfoValues = this.seatInfo.value;
    let mealInfoValues = this.mealInfo.value;

    bookingFormValues.Value.TextValue = bookingFormValues.Value.TextValue?.map(x => x).join(",");
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
            message: 'Please fill the form !'
          }
        })
      } else {
        if(this.booking && (this.bookingAndEligibility.invalid || this.bookingAndEligibility.pristine)) {
          this.loading = false;
            this.dialog.open(SuccessDialogComponent, {
              context: {
                title: 'Warning',
                message: 'Please fill the booking and eligibility form !'
              }
            })
        } else if (this.fareValue && ((this.amountperSegment.invalid || this.amountperSegment.pristine) || (this.fareTypeForm.invalid || this.fareTypeForm.pristine) || (this.bookingWindow.invalid || this.bookingWindow.pristine))) {
          this.loading = false;
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Warning',
              message: 'Please fill the budget and payment form !'
            }
          })
        } else if(this.convienence && ((this.cabinType.invalid || this.cabinType.pristine) || (this.seatInfo.invalid || this.seatInfo.pristine) || (this.mealInfo.invalid || this.mealInfo.pristine))) {
          this.loading = false;
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Warning',
              message: 'Please fill the comfort and convenience form !'
            }
          })
        } else {
            this.policyService.createPolicyApi(parentParam.id, parentParam.corpId, data).subscribe((res) => {
              this.loading = false;
              this.dialog.open(SuccessDialogComponent, {
                context: {
                  title: 'Policy Message',
                  message: 'Policy Created Successfully !'
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
            }
            )
        }
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
