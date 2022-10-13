import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-corporate-employee-section',
  templateUrl: './corporate-employee-section.component.html',
  styleUrls: ['./corporate-employee-section.component.scss']
})
export class CorporateEmployeeSectionComponent implements OnInit {

  userInfo: any;
  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private readonly storageService: StorageService) { }

  ngOnInit() {
    this.userInfo = this.storageService.getItems('userInfo');
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

  addProfile() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee-profile/createProfile`]);
  }

}
