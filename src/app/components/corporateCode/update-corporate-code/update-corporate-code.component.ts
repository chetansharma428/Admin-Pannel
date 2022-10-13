import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { CorporateCodeService } from '../../../lib/services/corporate-code.service/corporate-code.service';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-update-corporate-code',
  templateUrl: './update-corporate-code.component.html',
  styleUrls: ['./update-corporate-code.component.scss']
})
export class UpdateCorporateCodeComponent implements OnInit {

  branchDetails: any;
  createCorporateCode: FormGroup;
  AirlineName: Array<any> = [];
  branchId: any;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;
  corporateDetails:any;
  inputItemFormControl = new FormControl();
  loading: boolean = false;
  corporateId: any;
  queryParams: any;
  idsData: any;
  CorporateCodeData: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly branchService: BranchService, private readonly fb: FormBuilder,
    private readonly providerService: ProvidersService, private readonly corporateCodeService: CorporateCodeService,
    private dailog: NbDialogService, private readonly storageService: StorageService,
    private readonly branchStatusService: BranchSavingService,) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })

    this.idsData = this.storageService.getItems('dataForChannels');
    this.CorporateCodeData = this.branchStatusService.corporateCodeData;
    if(!this.CorporateCodeData) {
      const parentParam = this.activatedRoute.parent.snapshot.params;
      this.router.navigate([`${parentParam.id}/corporate-code`]);
    }

    this.createCorporateCodeFunction(this.CorporateCodeData);
  }

  createCorporateCodeFunction(data) {
    this.createCorporateCode = this.fb.group({
      airlineCode: [data?.airlineCode],
      branchId: [this.idsData?.branchId],
      corporateId: [this.idsData?.corporateId],
      providerId: [this.idsData?.providerId],
      corporateCode: [data?.corporateCode],
      tourCode: [data?.tourCode]
    })
    if(this.queryParams) {
      this.createCorporateCode.disable();
    }
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate-code`]);
  }

}
