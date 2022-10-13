import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-policy-type',
  template: '<nb-tag-list *ngFor="let policesValue of this.rowData?.policies"> <nb-tag style="margin: 10px" [text]="policesValue.productType"></nb-tag></nb-tag-list>',
})
export class PolicyTypeComponent implements OnInit {

  @Input() value;
  @Input() rowData;

  constructor() { }

  ngOnInit(): void {
  }

}
