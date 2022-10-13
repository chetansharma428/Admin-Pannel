import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-view-details',
  template: '<a href="javascript:void(0)" style="display: flex; justify-content: center;" (click)="onClick($event)">Details <nb-icon style="height: 20px; width: 20px; margin-left: 5px" icon="eye-outline"></nb-icon></a>',
})
export class ViewDetailsComponent implements OnInit {

  @Input() rowData;

  constructor(private readonly router: Router,) { }

  ngOnInit(): void {
  }

  onClick($event) {
    // console.log(this.rowData)
    this.router.navigate([`agency/${this.rowData.parentId}/staff/update-Details/${this.rowData.emailId}`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'});
  }

}
