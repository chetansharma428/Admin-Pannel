import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { CorporateCodeService } from '../../../lib/services/corporate-code.service/corporate-code.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-add-corporatecode',
  templateUrl: './add-corporatecode.component.html',
  styleUrls: ['./add-corporatecode.component.scss']
})
export class AddCorporatecodeComponent implements OnInit {

  branchDetails: any;
  createCorporateCode: FormGroup;
  AirlineName: Array<any> = [];
  branchId: any;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;
  corporateDetails:any;
  inputItemFormControl = new FormControl();
  inputItemFormControlProvider = new FormControl();
  loading: boolean = false;
  corporateId: any;
  providersData: any;
  providerId: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly branchService: BranchService, private readonly fb: FormBuilder,
    private readonly providerService: ProvidersService, private readonly corporateCodeService: CorporateCodeService,
    private dailog: NbDialogService,) { }

  ngOnInit(): void {
    this.AirlineName = ['AI', 'G8', 'UK', '6E', 'SG', 'I5', ]
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchService.fetchBranches(parentParam.id).subscribe((res: any) => {
      this.branchDetails = res?.items
    })
    this.createCorporateCodeFunction();
  }

  createCorporateCodeFunction () {
    this.createCorporateCode = this.fb.group({
      airlineCode: [null, [Validators.required]],
      corporateCode: [null, [Validators.required]],
      tourCode: [null, [Validators.required]]
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

  myValue(value) {
    let corporateId = value;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    // this.searchData.controls.providers.enable();
    this.providerService.fetchProviderDetails(parentParam, this.branchId, corporateId).subscribe((res: any) => {
      this.providersData = res?.Settings;
    })
  }

  onproviderSelected(value: string) {
    this.providerId = value;
  }

  create() {
    this.loading = true;
    if(this.findInvalidControls().length > 0) {
      this.loading = false;
      return false;
    } else {
      this.loading = false;
      const corporateCodeData = this.createCorporateCode.value;
      const parentParam = this.activatedRoute.parent.snapshot.params;
      if(this.branchId === null || this.branchId === undefined) {
        this.branchId = '*';
      }
      if(this.providerId === null || this.providerId === undefined) {
        this.providerId = '*';
      }
      if(this.inputItemFormControl.value === null || this.inputItemFormControl.value === undefined || this.inputItemFormControl.value === '*') {
        this.corporateId = '*';
      } else {
        let value = this.inputItemFormControl.value;
        let valueCorporate = this.corporateDetails.filter((corporate) => corporate.name === value);
        this.corporateId = valueCorporate[0]?.id;
      }
      this.corporateCodeService.createCorporateCode(parentParam, this.branchId, this.corporateId, this.providerId, corporateCodeData).subscribe((res) => {
        this.dailog.open(SuccessDialogComponent, {
          context: {
            title: 'Message',
            message: 'Corporate code created successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/corporate-code`]);
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

  public findInvalidControls() {
    const invalid = [];
    const controls = this.createCorporateCode.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }



  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate-code`]);
  }

}
