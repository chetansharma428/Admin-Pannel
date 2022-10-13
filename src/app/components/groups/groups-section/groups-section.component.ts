import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BulkUploadModalComponent } from '../bulk-upload-modal/bulk-upload-modal.component';

import { CreateGroupComponent } from '../create-group-modal/create-group-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-groups-section',
  templateUrl: './groups-section.component.html',
  styleUrls: ['./groups-section.component.scss']
})
export class GroupsSectionComponent implements OnInit {

  loginUserInfo: any;

  constructor(private dialogService: NbDialogService,
   private router: Router, private readonly storageService: StorageService, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loginUserInfo = this.storageService.getItems('userInfo');
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    if(this.loginUserInfo?.userType === 'agencyAdmin') {
      this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/profile`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'});
    } else if(this.loginUserInfo?.userType === 'corporateAdmin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  create_group() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/groups/createGroup`]);
  };

  open_bulk_modal() {
    this.dialogService.open(BulkUploadModalComponent, {
      context: {},


    });
  }
}
