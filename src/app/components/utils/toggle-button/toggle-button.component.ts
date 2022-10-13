import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-toggle-button',
  template: '<nb-toggle (click)="updateCorporate($event)" [checked]="rowData?.isActive"></nb-toggle>'
})
export class ToggleButtonComponent implements OnInit, ViewCell {
  @Input() value;
  @Input() rowData;

  @Output() toggleResponse: EventEmitter<any> = new EventEmitter()

  corporateList$: Observable<any>;

  constructor() { }

  ngOnInit(): void {}


  updateCorporate($event): void {
    $event.stopPropagation();
    this.toggleResponse.emit({ 'status': !this.rowData.isActive, 'data': this.rowData });
  }

}
