import { Component, Input, OnInit } from '@angular/core';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {

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
      airlineCode: { title: 'Airline Code', type: 'string' },
      corporateCode: { title: 'Corporate Code', type: 'string' },
      tourCode: { title: 'Tour Code', type: 'string' },
      // Providers: {
      //   title: 'Providers',
      //   type: 'custom',
      //   actions: false,
      //   renderComponent: ProvidersListComponent
      // },
      link: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        actions: false,
        renderComponent: ViewDetailsComponent
      }
    }
  }

  @Input() branchId: any;
  @Input() branchDetails: any;
  @Input() corporateCodeData: any;
  @Input() loadingData: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteConfirm(event): void { }

}
