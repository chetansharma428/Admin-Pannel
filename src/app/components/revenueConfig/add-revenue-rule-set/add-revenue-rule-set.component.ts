import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { RevenueService } from '../../../lib/services/revenue.service/revenue.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-add-revenue-rule-set',
  templateUrl: './add-revenue-rule-set.component.html',
  styleUrls: ['./add-revenue-rule-set.component.scss']
})
export class AddRevenueRuleSetComponent implements OnInit {

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
  minValueFrom = new Date();
  minValueTo = new Date();

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly branchService: BranchService, private readonly providerService: ProvidersService,
    private readonly fb: FormBuilder, private revenueService: RevenueService, private dailog: NbDialogService,) { }

  ngOnInit() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchService.fetchBranches(parentParam.id).subscribe((res: any) => {
      this.branchDetails = res?.items
    })
    this.createRuleFormFunction();
  }

  dateChange($event) {
    this.minValueTo = $event;
  }

  createRuleFormFunction() {
    this.createRuleForm = this.fb.group({
      Id: [null, [Validators.required]],
      Name: [null, [Validators.required]],
      AlwaysApply: !!Number([0, [Validators.required]]),
      Amount: [0, [Validators.required]],
      Applicability: [null, [Validators.required]],
      ApplyOn: [null, [Validators.required]],
      Category: [null, [Validators.required]],
      Currency: ['INR', [Validators.required]],
      IsEnabled: [null, [Validators.required]],
      Percentage: [0, [Validators.required]],
      Type: [null, [Validators.required]],
      ValidityEnd: [null, [Validators.required]],
      ValidityStart: [null, [Validators.required]],
      excludeInCalculation: [null, [Validators.required]],
      hideFromUser: [null, [Validators.required]],
      Rules: this.fb.array([]),
      taxComponents: this.fb.array([]),
    })

    // this.createRuleForm.get('Amount').enable();
    // this.createRuleForm.get('Percentage').disable();

    const Rules = this.createRuleForm.get('Rules') as FormArray;

    Rules.push(this.fb.group({
      "Key": ['DepartureDate', [Validators.required]],
      "IsEnabled": [null, [Validators.required]],
      "Operator": [null, [Validators.required]],
      "ValueType": [null],
      "ValueToCompare": [null, [Validators.required]]
    }))

    const taxComponents = this.createRuleForm.get('taxComponents') as FormArray;

    taxComponents.push(this.fb.group({
      'code': [null, [Validators.required]],
      'chooseForTax': ['Amount'],
      'currency': ['INR', [Validators.required]],
      'amount': [0, [Validators.required]],
      'percentage': [0, [Validators.required]]
    }))
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
      "Key": ['DepartureDate'],
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
      'chooseForTax': ['Amount'],
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
    if(this.findInvalidControls().length > 0) {
      this.loading = false;
      return false;
    } else {
      const formValue = this.createRuleForm.value;
      const parentParam = this.activatedRoute.parent.snapshot.params;
      formValue.Rules.forEach(element => {
        if(element.Key === 'DepartureDate' || element.Key === 'ArrivalDate') {
          element.ValueType = "DateTime";
        } else if(element.Key === 'SearchType' || element.Key === 'CabinType') {
          element.ValueType = "String";
        } else {
          element.ValueType = null;
        }
      });
      formValue.taxComponents.forEach(element => {
        delete element.chooseForTax;
      });
      console.log(formValue);
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
      this.revenueService.createRevenueRule(parentParam, this.branchId, this.corporateId, formValue).subscribe((res) => {
        this.loading = false;
        this.dailog.open(SuccessDialogComponent, {
          context: {
            title: 'Message',
            message: 'Revenue rule created successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/revenue`]);
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
