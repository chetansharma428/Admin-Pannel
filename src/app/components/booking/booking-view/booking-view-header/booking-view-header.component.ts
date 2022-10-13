import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-booking-view-header',
  templateUrl: './booking-view-header.component.html',
  styleUrls: ['./booking-view-header.component.scss']
})
export class BookingViewHeaderComponent implements OnInit {

  @Input() headerData: any;
  // confirmationVoucherBasePath: string = environment.confirmationVoucherBasePath;
  tripTitle: string;

  constructor() { }

  ngOnInit() {
    if (this.headerData.tripType == 'Return') {
      if (this.headerData.travelType == 'International') {
        this.tripTitle = `${this.headerData.searchRequest.segments[0].departureLocation.code} - ${this.headerData.searchRequest.segments[0].arrivalLocation.code} - ${this.headerData.searchRequest.segments[0].departureLocation.code}`;
      } else
        this.tripTitle = `${this.headerData.legs[0].departureAirport.code} - ${this.headerData.legs[0].arrivalAirport.code} - ${this.headerData.legs[this.headerData.legs.length - 1].arrivalAirport.code} `
    }
  }

  // openSendVoucherPopUp() {
  //   this.dialog.open(SendVoucherLayoverComponent, {
  //     data: {
  //       bookingId: this.headerData.bookingId
  //     }
  //   });
  // }
}
