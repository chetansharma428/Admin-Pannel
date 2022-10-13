import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchSavingService } from '../../../../../lib/services/login-status/branch-saving.service';

@Component({
  selector: 'ngx-view-details',
  template: '<a href="javascript:void(0)" style="display: flex; justify-content: center;" (click)="onClick($event)">Details <nb-icon style="height: 20px; width: 20px; margin-left: 5px" icon="eye-outline"></nb-icon></a>',
})
export class ViewDetailsComponent implements OnInit {

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private readonly branchStatusService: BranchSavingService,) { }

  @Input() rowData;

  ngOnInit(): void {
  }

  onClick($event) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchStatusService.passThroughConfig = this.rowData;
    this.router.navigate([`${parentParam.id}/passThrough/update-passthroughconfig/${this.rowData.profileId}`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'});
  }

}
