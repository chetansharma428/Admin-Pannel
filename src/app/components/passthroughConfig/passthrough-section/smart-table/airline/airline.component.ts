import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-airline',
  template: '<nb-tag-list *ngFor="let airlines of this.rowData?.Airline"> <nb-tag style="margin: 10px" [text]="airlines"></nb-tag></nb-tag-list>',
})
export class AirlineComponent implements OnInit {

  @Input() rowData;

  constructor() { }

  ngOnInit(): void {
  }

}
