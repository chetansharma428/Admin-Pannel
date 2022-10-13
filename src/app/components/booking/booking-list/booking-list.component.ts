import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { BookingService } from '../../../lib/services/booking-service/booking.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  @ViewChild('item') accordion;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;

  constructor(private readonly fb: FormBuilder, private readonly bookingService: BookingService, private readonly storageService: StorageService) { }
  advancedSearch: FormGroup;
  bookingStatus = ["Failed", "ConfirmationPending", "PendingConfirmation", "Confirmed", "Invoiced", "Reserved", "PartiallyConfirmed", "Cancelled", "PartiallyCancelled"];
  types = ['Flight', 'Hotel'];
  bookingList$: Observable<any>;
  corporates$: Observable<any>;
  response$:Observable<any>;
  items: number;
  bookings: any;
  corporateItem: any;
  loading: boolean = false;

  ngOnInit(): void {
    this.createAdvancedsearchform();
    fromEvent(this.corporate.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length >= 2),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((res: any) => {
      this.bookingService.getCorporate(res).subscribe(res => this.corporateItem = res);
    });
  }

  createAdvancedsearchform() {
    this.advancedSearch = this.fb.group({
      "type": [this.types[0]],
      "bookingdate": [],
      "bookingId": [],
      "bookingStatus": [],
      "corporateId": [],
      "EmployeeFirstName": [],
      "EmployeeLastName": [],
      "EmployeeId": [],
      "ApprovalCode": [],
      "departuredate": [],
      "pnr": []
    });
    this.fetchData();
  };

  fetchData(count?) {
    this.loading = true;
    const user = this.storageService.getItems('loggedinUserdetails')?.userDetails;
    const userInfo = this.storageService.getItems('userInfo');
    let branchId : any;
    let corporateId: any;
    let corporateData: any;
    let id: any;
    if (this.advancedSearch.value.corporateId) {
      corporateData = this.corporateItem.filter(res => res.name === this.advancedSearch.value.corporateId);
      corporateId = corporateData[0]?.id
    } else if(user?.Type === 2) {
      corporateId = user?.ParentId
    } else {
      corporateId = null;
    }

    if(user.Type === 1) {
      branchId = this.storageService.getItems('branchDetail')?.id;
    } else {
      branchId = userInfo?.branchIds;
    }

    if(user.Type === 1) {
      id = user?.ParentId;
    } else {
      id = user?.AgencyId;
    }

    const request = {
      "AgencyId": id,
      "ApprovalCode": this.advancedSearch.value.ApprovalCode,
      "BranchId": branchId,
      "CorporateId": corporateId,
      "EmployeeFirstName": this.advancedSearch.value.EmployeeFirstName,
      "EmployeeLastName": this.advancedSearch.value.EmployeeLastName,
      "EmployeeId": this.advancedSearch.value.EmployeeId,
      "FacilitatorId": user.SearchType === 'corporateemployee' ? user.EmailId : null,
      "Filter": {
        "Status": this.advancedSearch.value.bookingStatus ? this.advancedSearch.value.bookingStatus : this.bookingStatus,
        "ProductType": this.advancedSearch.value.type,
        "TravelDateOption": null
      },
      "Skip": count ? (count - 1) * 10 : 0,
      "Take": 10
    };

    if (this.advancedSearch.value.departuredate) {
      const date = this.advancedSearch.value.departuredate;
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + (date.getDate())).slice(-2)
      request['TravelDate'] = `${year}-${month}-${day}`;
    }
    if (this.advancedSearch.value.bookingdate) {
      const date = this.advancedSearch.value.bookingdate;
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + (date.getDate())).slice(-2)
      request['BookingDate'] = `${year}-${month}-${day}`;
    }
    if (this.advancedSearch.value.bookingId) {
      request['BookingId'] = this.advancedSearch.value.bookingId;
    }
    if (this.advancedSearch.value.pnr) {
      request['PNR'] = this.advancedSearch.value.pnr;
    }

    this.bookingList$ = this.bookingService.fetchBookinglist(request).pipe(
      map((res: any) => {
        const bookingData = this.bookingService.transformBookingList(res);
        this.items = res.totalItems;
        this.bookings = this.bookingService.transformBookings(res.bookings);
        this.loading = false;
        return bookingData;
      },
      (error) => {
        this.loading = false;
      }
      )
    );
  };

  resetForm() {
    this.advancedSearch.reset();
  };

  toggle() {
    this.accordion.toggle();
  };

  gridCount($event) {
    this.fetchData($event);
  }
}
