import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-policy-name',
  template: '<nb-tag-list *ngFor="let policesValue of this.rowData?.policies"> <nb-tag style="margin: 10px" [text]="policesValue.name"></nb-tag></nb-tag-list>',
})
export class PolicyNameComponent implements OnInit {

  @Input() value;
  @Input() rowData;

  constructor() { }

  ngOnInit() {
  }

}
