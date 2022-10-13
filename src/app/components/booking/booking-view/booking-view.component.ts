import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BookingService } from '../../../lib/services/booking-service/booking.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-booking-view',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.scss']
})
export class BookingViewComponent implements OnInit {
  selectedBooking: any;
  flightProduct: any;
  headerData: any;
  statusBarData: any;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly bookingService: BookingService, 
    private readonly storageService: StorageService, private readonly router: Router) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.bookingService.fetchBookingdetails(params).subscribe((res: any) => {
      if (res && res.bookings && res.bookings.length > 0) {
        this.selectedBooking = res.bookings[0];
        this.flightProduct = this.selectedBooking.products.find(product => product.type.toLowerCase() === 'flight');
        this.setupDataForHeader();
        this.setupStatusBarData();
      }
    });
  };

  setupDataForHeader() {
    this.headerData = {
      legs: this.flightProduct.legs,
      from: this.flightProduct.origin.code,
      to: this.flightProduct.destination.code,
      createdOn: this.parseDateTime(this.selectedBooking.bookingDate),
      bookingId: this.selectedBooking.bookingId,
      tripType: this.flightProduct.searchInitRequest.tripType,
      travelType: this.flightProduct.searchInitRequest.travelType,
      bookingStatus: this.selectedBooking.bookingStatus,
      searchRequest: this.flightProduct.searchInitRequest
    }
  };

  setupStatusBarData() {
    // console.log(this.selectedBooking);
    this.statusBarData = {
      userType: this.storageService.getUserInfo()?.userType || null,
      bookingStatus: this.flightProduct.bookingStatus,
      agencyName: this.selectedBooking.agencyName,
      bookedBy: this.selectedBooking.facilitatorId,
      companyName: this.selectedBooking.corporateName,
      flightProduct: this.flightProduct,
      cardId: this.selectedBooking.id,
      productId: this.selectedBooking.products,
      agencyDetails: {
        // agencyAddress: '',
        agencyPhoneNumber: this.selectedBooking.agencyPointOfContactId
      },
      bookedByDetails: {
        bookerName: this.selectedBooking.facilitaorName,
        bookerPhoneNumber: this.selectedBooking?.branchPointOfContact || null
      },
      corporateDetails: {
        gstNumber: this.selectedBooking.corporateGST,
        corporateAddress: this.getCorporateAdrress(),
        corporateEmailId: this.selectedBooking.corporatePointOfContactId,
        corporatePhoneNumber: this.selectedBooking.payment?.billingPhone || null
      }
    }
  };

  getCorporateAdrress() {
    let address: string = '';
    if (this.selectedBooking.payment?.billingAddress?.city)
      address = `${address} ${this.selectedBooking.payment?.billingAddress?.city}`;
    if (this.selectedBooking.payment?.billingAddress?.state)
      address = `${address} ${this.selectedBooking.payment?.billingAddress?.state}`;
    if (this.selectedBooking.payment?.billingAddress?.country)
      address = `${address} ${this.selectedBooking.payment?.billingAddress?.country}`;
    return address;
  }

  private parseDateTime(rawDateTime: string) {
    if (rawDateTime) {
      var bookedDateTime = moment.utc(rawDateTime).local();
      return `${bookedDateTime.date().toString()}-${(bookedDateTime.month() + 1).toString()}-${bookedDateTime.year().toString()}-${bookedDateTime.hours().toString()}:${bookedDateTime.minutes().toString()}:${bookedDateTime.seconds().toString()}`
    }
    return '';
  }

  back() {
    this.router.navigate(['booking/list']);
  }
}
