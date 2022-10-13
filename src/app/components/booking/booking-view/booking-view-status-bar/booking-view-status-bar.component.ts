import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from '../../../../lib/services/booking-service/booking.service';

@Component({
  selector: 'ngx-booking-view-status-bar',
  templateUrl: './booking-view-status-bar.component.html',
  styleUrls: ['./booking-view-status-bar.component.scss']
})
export class BookingViewStatusBarComponent implements OnInit {

  @Input() statusBarData: any;
  @Input() cart: any;
  agencyHeader;
  agencyContent;
  bookedByHeader;
  bookedByContent;
  companyInfoHeader;
  companyInfoContent;
  productId: any;

  displayAgencyDetails = false;
  displayBookedByDetails = false;
  displayGstDetails = false;
  isTravelDatePast: boolean;
  cancelledBookingButton: boolean;
  cancelBookingButton: boolean;
  flightProductData: any;

  constructor(
    private bookingService: BookingService
  ) { }

  ngOnInit() {
    this.bookingService.closeEvent.subscribe((eventValue: string) => {
      this[`${eventValue}`] = false;
    });
    let now = new Date();
    let travelDate = new Date(this.statusBarData.flightProduct.travelDate);

    if (now.getTime() > travelDate.getTime()) {
      this.isTravelDatePast = true;
    } else {
      this.isTravelDatePast = false;
    }

    this.agencyHeader = {
      key: 'displayAgencyDetails',
      value: 'Agency Details'
    };
    this.agencyContent = [
      {
        key: 'phNumber',
        value: this.statusBarData?.agencyDetails?.agencyPhoneNumber,
        icon: 'fas fa-phone-square-alt',
        bolder: true
      }
    ];

    this.bookedByHeader = {
      key: 'displayBookedByDetails',
      value: 'Booked By Details'
    };

    this.bookedByContent = [
      {
        key: 'name',
        value: this.statusBarData?.bookedByDetails?.bookerName,
        icon: 'fas fa-user',
        bolder: false
      },
      {
        key: 'phNumber',
        value: this.statusBarData?.bookedByDetails?.bookerPhoneNumber,
        icon: 'fas fa-phone-square-alt',
        bolder: true
      }
    ];

    this.companyInfoHeader = {
      key: 'displayGstDetails',
      value: 'GST Details'
    };

    this.companyInfoContent = [
      {
        key: 'gst',
        value: this.statusBarData?.corporateDetails?.gstNumber,
        icon: 'fas fa-money-check-alt',
        bolder: false
      },
      {
        key: 'location',
        value: this.statusBarData?.corporateDetails?.corporateAddress,
        icon: 'fas fa-map-marker-alt',
        bolder: false
      },
      {
        key: 'mail',
        value: this.statusBarData?.corporateDetails?.corporateEmailId,
        icon: 'fas fa-envelope',
        bolder: false
      },
      {
        key: 'phNumber',
        value: this.statusBarData?.corporateDetails?.corporatePhoneNumber,
        icon: 'fas fa-phone-square-alt',
        bolder: false
      }
    ];

    if(this.statusBarData.bookingStatus === "Cancelled") {
      this.cancelledBookingButton = true;
    } else {
      this.cancelledBookingButton = false;
    }
  }

  togglePopUp(popupName: string) {
    this[`${popupName}`] = !this[`${popupName}`];
  }

  openTripCancellationOverlay() {
    this.statusBarData.productId.forEach(element => {
      this.productId = element.id;
    });
    // let checkingCancelledBookingStatus = [];
    let checkingConfirmedBookingStatus = [];
    this.flightProductData = this.statusBarData.flightProduct;
    let legsIndex = this.flightProductData.flightOptions.length;
    this.flightProductData.bookings.map(booking => {
     if(booking.status === 'Confirmed') {
      checkingConfirmedBookingStatus.push(booking);
     }
    });
    let invoicedlegs =  checkingConfirmedBookingStatus.length;
    let segmentsData = [];
    checkingConfirmedBookingStatus.map((data1) => {
      segmentsData.push(data1.segmentId)
    })
    segmentsData.sort();
    let cancellationTypeForMultiple = "SpecificSegments";
    let cartId = this.statusBarData.cardId;
    let productId = this.productId;
    let ProductType = this.statusBarData.flightProduct.type;
    let cancellation = "Complete";
    // let dialogRef =  this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //   data: {
    //     showProgress: true
    //   }
    // });
   
    // if(legsIndex === invoicedlegs) { 
    //   this._flightCancellationService.allFlightCancellation(productId, cancellation, ProductType, cartId).subscribe((res) => {
    //     dialogRef.close();
    //     let showFailurePopup = false;
    //     let segmentMen = (res.SegmentCancellationCharges || []).forEach(charges => {
    //       if (charges === null) {
    //         showFailurePopup = true;
    //       } else if (charges.ConvenienceFees.amount === null) {
    //         showFailurePopup = true;
    //       }
    //     });
    //     if (showFailurePopup) {
    //       this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //         disableClose: true,
    //         data: {
    //           showError: true
    //         }
    //       });
    //     } else {
    //       this._flightCancellationService.cancellationData = res;
    //       this._tripCancellationDialog.open(FlightCancellationOverlayComponent, { disableClose: true,
    //         data: {
    //         showError: true
    //       } });
    //       this._flightCancellationService.productId = this.productId;
    //       this._flightCancellationService.cart = this.cart;
    //       this._flightCancellationService.segmentIds = null;
    //       this._flightCancellationService.flightDetails = this.statusBarData.flightProduct;
    //       this._flightCancellationService.cardId = cartId;
    //       this._flightCancellationService.cancellationType = cancellation;
    //       this._flightCancellationService.productType = ProductType;
    //     }
  
    //   },
    //     (error) => {
    //       dialogRef.close();
    //       this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //         disableClose: true,
    //         data : {
    //           showError: true
    //         }
    //       });
    //     }
    //   );
    // } else if(legsIndex > invoicedlegs ) {
    //   this._flightCancellationService.multipleFlightSegmentCancellation(productId, segmentsData, cancellationTypeForMultiple, ProductType, cartId).subscribe((res) => {
    //     dialogRef.close();
    //     let showFailurePopup = false;
    //     let segmentMen = (res.SegmentCancellationCharges || []).forEach(charges => {
    //       if (charges === null) {
    //         showFailurePopup = true;
    //       } else if (charges.ConvenienceFees.amount === null) {
    //         showFailurePopup = true;
    //       }
    //     });
    //     if (showFailurePopup) {
    //       this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //         disableClose: true,
    //         data: {
    //           showError: true
    //         }
    //       });
    //     } else {
    //       this._flightCancellationService.cancellationData = res;
    //       this._tripCancellationDialog.open(FlightCancellationOverlayComponent, { disableClose: true,
    //         data: {
    //         showError: true
    //       } });
    //       this._flightCancellationService.productId = this.productId;
    //       this._flightCancellationService.cart = this.cart;
    //       this._flightCancellationService.flightDetails = this.statusBarData.flightProduct;
    //       this._flightCancellationService.cardId = cartId;
    //       this._flightCancellationService.segmentIds = segmentsData;
    //       this._flightCancellationService.cancellationType = cancellation;
    //       this._flightCancellationService.productType = ProductType;
    //     }
  
    //   },
    //     (error) => {
    //       dialogRef.close();
    //       this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //         disableClose: true,
    //         data : {
    //           showError: true
    //         }
    //       });
    //     }
    //   );
    // } else {
    //     dialogRef.close();
    //     this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //       disableClose: true,
    //       data: {
    //         showError: true
    //       }
    //     });
    // }
  }

  changeBookingStatus(status: string) {
    // this._changeBookingStatusDialog.open(
    //   StatusChangeConfirmationOverlayComponent
    // );
  }

}
