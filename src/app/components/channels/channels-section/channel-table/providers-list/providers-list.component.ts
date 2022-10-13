import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-providers-list',
  template: '<nb-tag-list *ngFor="let value of this.rowData?.Providers"> <nb-tag style="margin: 10px" [text]="value"></nb-tag></nb-tag-list>',
})
export class ProvidersListComponent implements OnInit {

  @Input() rowData;

  constructor() { }

  ngOnInit(): void {
  }

}
