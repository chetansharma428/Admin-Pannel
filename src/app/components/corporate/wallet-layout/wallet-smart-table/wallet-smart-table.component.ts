import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-wallet-smart-table',
  templateUrl: './wallet-smart-table.component.html',
  styleUrls: ['./wallet-smart-table.component.scss']
})
export class WalletSmartTableComponent implements OnInit {

  @Input() transactionRecord: any;
  @Input() loadingTable: boolean;
// pager.perPage: 25,
  settings = {
    actions: {
      delete: false,
      add: false,
      edit: false,
    },
    columns: {
      transactionDate: {
        title: 'Transaction Date',
        type: 'string',
        filter: false,
        width: '20%',
        valuePrepareFunction: (transactionDate) => {
          return this.datePipe.transform(new Date(transactionDate), 'dd MMM yyyy, hh:mm a');
        }
      },
      transactionId: {
        title: 'Transaction ID',
        type: 'string',
        filter: false
      },
      transactionMode: {
        title: 'Transaction Type',
        type: 'string',
        filter: false
      },
      credit: {
        title: 'Transaction Amount',
        type: 'string',
        filter: false,
      },
      currentCredit: {
        title: 'Balance',
        type: 'string',
        filter: false,
        valuePrepareFunction: (currentCredit) => {
          return Intl.NumberFormat('en-US',{style:'currency', currency: 'INR'}).format(currentCredit);
        }
      },
      remark: {
        title: 'Remarks',
        type: 'string',
        filter: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  sourceData: Array<any> = [];

  constructor(private datePipe: DatePipe) {

   }

  ngOnInit(): void {
  }

  // onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     event.confirm.resolve();
  //   } else {
  //     event.confirm.reject();
  //   }
  // }

}
