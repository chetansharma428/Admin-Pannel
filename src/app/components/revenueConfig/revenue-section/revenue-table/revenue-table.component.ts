import { Component, Input, OnInit } from '@angular/core';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Component({
  selector: 'ngx-revenue-table',
  templateUrl: './revenue-table.component.html',
  styleUrls: ['./revenue-table.component.scss']
})
export class RevenueTableComponent implements OnInit {

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
      Id: { title: 'Id', type: 'string' },
      Name: { title: 'Name', type: 'string' },
      Type: {title: 'Type', type: 'string'},
      Amount: {title: 'Amount', type:'string'},
      Percentage: { title: 'Percentage', type: 'string' },
      Applicability: {title: 'Applicability', type: 'string'},
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
  @Input() revenueData: any;


  constructor() { }

  ngOnInit(): void {
  }

  onDeleteConfirm($event) {

  }

}
