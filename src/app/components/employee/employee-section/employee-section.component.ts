import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CorporateService } from '../../../lib/services/corporate-service/corporate/corporate.service';
import { EmployeeService } from '../../../lib/services/employee-service/employee.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
@Component({
  selector: 'ngx-employee-section',
  templateUrl: './employee-section.component.html',
  styleUrls: ['./employee-section.component.scss']
})
export class EmployeeSectionComponent implements OnInit {

  userInfo: any;
  corporateData:any;
  branchId: any;
  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly storageService: StorageService,
    private readonly corporateService: CorporateService,) { }

  ngOnInit(): void {
    this.userInfo = this.storageService.getItems('userInfo');
    const parentParam = this.activatedRoute.parent.snapshot.params;
    if(this.userInfo?.userType === 'agencyAdmin') {
      this.branchId = this.storageService.getItems('branchDetail')?.id;
    } else {
      this.branchId = this.storageService.getItems('corporateDetails')?.associatedOrgId;
    }
    this.corporateService.fetchCorporatedata(parentParam, this.branchId).subscribe((res) => {
      this.corporateData = res;
    })
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    if(this.userInfo?.userType === 'agencyAdmin') {
      this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/profile`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'});
    } else if(this.userInfo?.userType === 'corporateAdmin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  registerEmployee() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee/register`])
  }
}
