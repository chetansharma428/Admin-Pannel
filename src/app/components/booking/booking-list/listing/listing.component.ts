import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MoreInfoComponent } from '../../../utils/more-info/more-info.component';

@Component({
  selector: 'ngx-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  @Input() value;
  @Input() items;
  @Input() bookings;
  @Output() gridCount = new  EventEmitter();
  test: any;
  bookingList$: Observable<any>;
  bookingParams: any;
  settings = {
    mode: 'external',
    hideSubHeader: true,
    pager: { display: false },
    actions: {
      add: false,
      delete: false,
      edit: false
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      itinerary: { title: 'Bookings', type: 'string' },
      bookingId: { title: 'Booking Id', type: 'string' },
      departureDate: {
        title: 'Departure Date', type: 'string',
        valuePrepareFunction: (transactionDate) => {
          if(transactionDate)
          return this.datePipe.transform(new Date(transactionDate), 'dd MMM yyyy');
        }
      },
      bookingDate: {
        title: 'Booking Date', type: 'string',
        valuePrepareFunction: (transactionDate) => {
          if(transactionDate)
          return this.datePipe.transform(new Date(transactionDate), 'dd MMM yyyy');
        }
      },
      link: {
        title: 'More Info',
        type: 'custom',
        actions: false,
        renderComponent: MoreInfoComponent,
        onComponentInitFunction: (instance: any) => {
          instance.toggleResponse.subscribe(res => {
            this.router.navigate([`booking/${res.bookingId}/details`]);
          });
        }
      }
    },
    noDataMessage: "Bookings not available"
  };
  pageSize: number = 10;
  currentPageNum: number = 1;
  request: any

  constructor(private readonly router: Router, private readonly datePipe: DatePipe) { }

  ngOnInit(): void { };


  onTripsTablePageChange($event) {
    this.currentPageNum = $event;
    this.gridCount.emit($event);
  }
}
