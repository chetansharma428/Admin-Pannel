import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { PassthroughService } from '../../../lib/services/passthrough.service/passthrough.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-update-passconfig',
  templateUrl: './update-passconfig.component.html',
  styleUrls: ['./update-passconfig.component.scss']
})
export class UpdatePassconfigComponent implements OnInit {

  createPassThroughForm: FormGroup;
  branchId: any;
  branchDetails: any;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;
  corporateDetails:any;
  inputItemFormControl = new FormControl();
  loading: boolean = false;
  AirlineName: Array<any> = [];
  corporateId: any;
  idsData: any;
  passThroughConfigData: any;
  queryParams: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly fb: FormBuilder, private readonly branchService: BranchService,
    private readonly providerService: ProvidersService, private readonly passThroughConfigService: PassthroughService,
    private dailog: NbDialogService, private readonly storageService: StorageService,
    private readonly branchStatusService: BranchSavingService,) { }

  ngOnInit(): void {
    this.AirlineName = ['AI', 'G8', 'UK', '6E', 'SG', 'I5', ]
    this.activatedRoute.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })

    this.idsData = this.storageService.getItems('dataForChannels');
    console.log(this.idsData);
    this.passThroughConfigData = this.branchStatusService.passThroughConfig;
    if(!this.passThroughConfigData) {
      const parentParam = this.activatedRoute.parent.snapshot.params;
      this.router.navigate([`${parentParam.id}/passThrough`]);
    }

    this.createPassThroughConfig(this.passThroughConfigData);
  }

  createPassThroughConfig(data) {
    this.createPassThroughForm = this.fb.group({
      profileId: [data?.profileId],
      profileKey: [data?.profileKey],
      branchId: [this.idsData?.branchId],
      corporateId: [this.idsData?.corporateId],
      cardType: [data?.cardType],
      lastFourDigits: [data?.lastFourDigits],
      ledgerCode: [data?.ledgerCode],
      Airline: [data?.Airline]
    })

    if(this.queryParams) {
      this.createPassThroughForm.disable();
    }
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
