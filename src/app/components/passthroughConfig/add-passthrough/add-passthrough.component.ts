import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { PassthroughService } from '../../../lib/services/passthrough.service/passthrough.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-add-passthrough',
  templateUrl: './add-passthrough.component.html',
  styleUrls: ['./add-passthrough.component.scss']
})
export class AddPassthroughComponent implements OnInit {

  createPassThroughForm: FormGroup;
  branchId: any;
  branchDetails: any;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;
  corporateDetails:any;
  inputItemFormControl = new FormControl();
  loading: boolean = false;
  AirlineName: Array<any> = [];
  corporateId: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly fb: FormBuilder, private readonly branchService: BranchService,
    private readonly providerService: ProvidersService, private readonly passThroughConfigService: PassthroughService,
    private dailog: NbDialogService,) { }

  ngOnInit(): void {
    this.AirlineName = ['AI', 'G8', 'UK', '6E', 'SG', 'I5', ]
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchService.fetchBranches(parentParam.id).subscribe((res: any) => {
      this.branchDetails = res?.items
    })

    this.createPassThroughConfig();
  }

  createPassThroughConfig() {
    this.createPassThroughForm = this.fb.group({
      profileId: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
      profileKey: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
      cardType: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
      lastFourDigits: [null, Validators.required],
      ledgerCode: [null, Validators.required],
      Airline: []
    })
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

  create() {
    this.loading = true;
    if(this.findInvalidControls().length > 0) {
      this.loading = false;
      return false
    } else {
      this.loading = false;
      const passThroughData = this.createPassThroughForm.value;
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
      this.passThroughConfigService.createPassThroughConfig(parentParam, this.branchId, this.corporateId, passThroughData)
      .subscribe((res) => {
        this.dailog.open(SuccessDialogComponent, {
          context: {
            title: 'Message',
            message: 'Pass through config created successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/passThrough`]);
        })
      },
      (error) => {
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
    this.router.navigate([`${parentParam.id}/passThrough`]);
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.createPassThroughForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

}
