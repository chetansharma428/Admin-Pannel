import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-more-info',
  template: '<a href="javascript:void(0)" style="display: flex; justify-content: center;" (click)="onClick($event)">Details <nb-icon style="height: 20px; width: 20px; margin-left: 5px" icon="eye-outline"></nb-icon></a>',
})
export class MoreInfoComponent implements OnInit {
  @Input() rowData;

  @Output() toggleResponse: EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  onClick($event) {
    this.toggleResponse.emit(this.rowData);
  }

}
