import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchSavingService } from '../../../../../lib/services/login-status/branch-saving.service';

@Component({
  selector: 'ngx-view-details',
  template: '<a href="javascript:void(0)" style="display: flex; justify-content: center;" (click)="onClick($event)">Details <nb-icon style="height: 20px; width: 20px; margin-left: 5px" icon="eye-outline"></nb-icon></a>',
})
export class ViewDetailsComponent implements OnInit {

  @Input() rowData;

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private readonly branchStatusService: BranchSavingService,) { }

  ngOnInit(): void {
    // console.log(this.rowData);
  }

  onClick($event) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchStatusService.channcelData = this.rowData;
    // this.branchStatusService.setChannelSubject(this.rowData);
    this.router.navigate([`${parentParam.id}/channels/update-channels/${this.rowData.ChannelId}`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'});
  }

}
