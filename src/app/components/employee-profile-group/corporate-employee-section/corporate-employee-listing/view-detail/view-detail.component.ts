import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-view-detail',
  template: '<a href="javascript:void(0)" style="display: flex; justify-content: center;" (click)="onClick($event)">Details <nb-icon style="height: 20px; width: 20px; margin-left: 5px" icon="eye-outline"></nb-icon></a>',
})
export class ViewDetailComponent implements OnInit {

  @Input() rowData;

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onClick($event) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee-profile/${this.rowData.id}`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'});
  }

}
