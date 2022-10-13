import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-view-details',
  template: '<a href="javascript:void(0)" style="display: flex; justify-content: center;" (click)="onClick($event)">Details <nb-icon style="height: 20px; width: 20px; margin-left: 5px" icon="eye-outline"></nb-icon></a>',
})
export class ViewDetailsComponent implements OnInit {

  @Input() rowData;
  @Input() singleSelectGroupValue: Array<any> = [];

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
  }

  onClick($event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/policy/update_Policy/${this.rowData.productType}/${this.rowData.id}`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'});
  };

}
