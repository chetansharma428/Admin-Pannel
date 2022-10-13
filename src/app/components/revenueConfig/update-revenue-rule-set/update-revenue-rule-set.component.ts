import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { RevenueService } from '../../../lib/services/revenue.service/revenue.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-update-revenue-rule-set',
  templateUrl: './update-revenue-rule-set.component.html',
  styleUrls: ['./update-revenue-rule-set.component.scss']
})
export class UpdateRevenueRuleSetComponent implements OnInit {

  @ViewChild('corporate', { static: true }) corporate: ElementRef;

  branchDetails: any;
  inputItemFormControl = new FormControl();
  corporateDetails:any;
  branchId: any;
  key = ['DepartureDate', 'ArrivalDate' ,'SearchType', 'CabinType'];
  createRuleForm: FormGroup;
  chooseFrom = new FormControl('amount');

  loading: boolean = false;
  corporateId: any;
  queryParams: any;

  revenueData: any;
  idsData: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly branchService: BranchService, private readonly providerService: ProvidersService,
    private readonly fb: FormBuilder, private revenueService: RevenueService, private dailog: NbDialogService,
    private readonly storageService: StorageService, private readonly branchStatusService: BranchSavingService,) { }

  ngOnInit(): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.activatedRoute.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this.idsData = this.storageService.getItems('dataForChannels');
    this.revenueData = this.branchStatusService.ruleSetsData;
    if(!this.revenueData) {
      const parentParam = this.activatedRoute.parent.snapshot.params;
      this.router.navigate([`${parentParam.id}/revenue`]);
    }
    this.createRuleFormFunction(this.revenueData);
  }

  createRuleFormFunction(data) {
    this.createRuleForm = this.fb.group({
      Id: [data?.Id],
      Name: [data?.Name],
      AlwaysApply: [data?.AlwaysApply],
      Amount: [data?.Amount],
      branchId: [this.idsData.branchId],
      Applicability: [data?.Applicability],
      ApplyOn: [data?.ApplyOn],
      Category: [data?.Category],
      Currency: ['INR'],
      IsEnabled: [data?.IsEnabled],
      Percentage: [data?.Percentage],
      Type: [data?.Type],
      ValidityEnd: [data?.ValidityEnd],
      ValidityStart: [data?.ValidityStart],
      excludeInCalculation: [data?.excludeInCalculation],
      hideFromUser: [data?.hideFromUser],
      Rules: this.fb.array([]),
      taxComponents: this.fb.array([]),
    })

    this.inputItemFormControl.setValue(this.idsData.corporateId);

    const Rules = this.createRuleForm.get('Rules') as FormArray;
    data?.Rules.forEach(element => {
      Rules.push(this.fb.group({
        "Key": [element.Key],
        "IsEnabled": [element.IsEnabled],
        "Operator": [element.Operator],
        "ValueType": [element.ValueType],
        "ValueToCompare": [element.ValueToCompare]
      }))
    });


    const taxComponents = this.createRuleForm.get('taxComponents') as FormArray;
    data?.taxComponents?.forEach(element => {
      taxComponents.push(this.fb.group({
        'code': [element?.code],
        'currency': [element?.currency],
        'amount': [element?.amount],
        'percentage': [element?.percentage]
      }))
    });


    if (this.queryParams) {
      this.createRuleForm.disable();
    }
  }

  onBranchSelected($event) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchId = $event;
    fromEvent(this.corporate.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length >= 2),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((res: any) => {
      this.providerService.getCorporate(res, this.branchId, parentParam).subscribe(res => this.corporateDetails = res)
    });
  }

  selectionBased(chooseFrom) {
    let value = chooseFrom.value;
    if(value === "amount") {
      this.createRuleForm.get('Percentage').enable();
      this.createRuleForm.get('Amount').disable();
    } else {
      this.createRuleForm.get('Amount').enable();
      this.createRuleForm.get('Percentage').disable();
    }
  }

  addRules() {
    const control = this.createRuleForm.get('Rules') as FormArray;
    control.push(this.fb.group ({
      "Key": [null],
      "IsEnabled": [null],
      "Operator": [null],
      "ValueType": [null],
      "ValueToCompare": [null]
    }))
  }

  addTax() {
    const control1 = this.createRuleForm.get('taxComponents') as FormArray;
    control1.push(this.fb.group({
      'code': [null],
      'currency': ['INR'],
      'amount': [0],
      'percentage': [0]
    }))
  }

  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  deleteTax(taxIndex: number) {
    const control = this.createRuleForm.get('taxComponents') as FormArray;
    control.removeAt(taxIndex)
  }

  deleteRuless(rulesIndex: number) {
    const control = this.createRuleForm.get('Rules') as FormArray;
    control.removeAt(rulesIndex)
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/revenue`]);
  }

  createRule() {
    this.loading = true;
    if(this.findInvalidControls.length > 0) {
      this.loading = false;
      return false;
    } else {
      console.log(this.createRuleForm.value);
      const formValue = this.createRuleForm.value;
      const parentParam = this.activatedRoute.parent.snapshot.params;
      if(this.branchId === null || this.branchId === undefined) {
        this.branchId = '*';
      }
      if(this.inputItemFormControl.value === '*') {
        this.corporateId = '*';
      } else {
        let value = this.inputItemFormControl.value;
        let valueCorporate = this.corporateDetails.filter((corporate) => corporate.name === value);
        this.corporateId = valueCorporate[0]?.id;
      }
      this.revenueService.createRevenueRule(parentParam, this.branchId, this.corporateId, formValue).subscribe((res) => {
        this.loading = false;
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
        this.loading = false;
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

  public findInvalidControls() {
    const invalid = [];
    const controls = this.createRuleForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    console.log(invalid);
    return invalid;
  }

}
