import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-permission-list',
  template: '<nb-tag-list *ngFor="let permissionValue of this.rowData?.permissionsList"> <nb-tag style="margin: 10px" [text]="permissionValue"></nb-tag></nb-tag-list>'
})
export class PermissionListComponent implements OnInit {

  @Input() value;
  @Input() rowData;

  constructor() { }

  ngOnInit() {
    // console.log(this.rowData);
  }

}
