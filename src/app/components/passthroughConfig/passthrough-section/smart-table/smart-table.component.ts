import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AirlineComponent } from './airline/airline.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {

  @Input() loading: boolean;

  settings = {
    mode: 'external',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      profileId: { title: 'Profile Id', type: 'string' },
      profileKey: { title: 'Profile Key', type: 'string' },
      cardType: { title: 'Card Type', type: 'string' },
      lastFourDigits: {title: 'Last Four Digits', type: 'string'},
      custom: {
        title: 'Airline',
        type:'custom',
        action: false,
        renderComponent: AirlineComponent
      },
      link: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        actions: false,
        renderComponent: ViewDetailsComponent
      }
    }
  }

  branchId: any;
  branchDetails: any;
  @Input() passThroughData: any;

  providerDetails$: Observable<any>;
  private providerList$ = new Subject<null>();

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteConfirm($event) {

  }

}
