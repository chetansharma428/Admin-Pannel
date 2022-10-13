import { DatePipe } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api-service/api.service';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private myTripsListing = [];
  closeEvent: EventEmitter<string> = new EventEmitter<string>();


  constructor(private readonly apiService: ApiService, private readonly storageService: StorageService, private readonly datePipe: DatePipe) { }

  fetchBookinglist(params) {
    const url = `${environment.apiUrls.cartAPI}bookings`;
    return this.apiService.post(url, params, {});
  }

  fetchBookingdetails(data) {
    const url = `${environment.apiUrls.cartAPI}bookings`;

    const user = this.storageService.getItems('loggedinUserdetails')?.userDetails;
    const branchId = this.storageService.getItems('branchDetail')?.id;

    /**TODO: Need to check the request */
    const params = {
      "AgencyId": user.Type === "1" ? user.agencyId : user.ParentId,
      "CorporateId": null,
      "FacilitatorId": null,
      "BranchId": branchId,
      "BookingId": data.bookingId,
      "Filter": { "BookingId": data.bookingId, "TravelDateOption": null }
    };

    return this.apiService.post(url, params, {});
  }

  transformBookingList(res) {
    const bookingResponse = res.bookings;
    let locationName: string = '';
    this.myTripsListing = [];

    bookingResponse?.forEach((booking) => {
      booking?.products.forEach((product) => {
        var departureDate: Date | string = new Date();
        if (product.type == "Flight") {
          departureDate = product.travelDate ? new Date(product.travelDate) : "";
        }
        if (product.type == "Hotel") {
          departureDate = product.searchInitRequest.checkIn ? new Date(product.searchInitRequest.checkIn) : "";
        }
        if (product.type === 'Hotel' && product?.searchInitRequest?.locationName != null) {
          locationName = ", " + product?.searchInitRequest?.locationName;
        }


        this.myTripsListing.push({
          itinerary: product.type === 'Flight' ? this.getItinerary(product, booking.isDomestic) : product?.searchInitRequest?.content?.name,
          departureDate: departureDate,
          locationName: locationName,
          bookingDate: booking.bookingDate ? new Date(booking.bookingDate) : "",
          bookingId: booking.bookingId,
          bookingStatus: product.type === 'Flight' ? product.bookingStatus : booking.bookingStatus,
          type: product.type
        })
      })
    });

    return this.myTripsListing;
  };

  closeDetails(value: string) {
    this.closeEvent.emit(value);
  }

  getCorporate(res) {
    const user = this.storageService.getItems('loggedinUserdetails')?.userDetails;
    const branchId = this.storageService.getItems('branchDetail')?.id;
    const url = `${environment.apiUrls.profileApi}agencies/${user.Type === "1" ? user.agencyId : user.ParentId}/corporates?isActive=true&AssociatedOrgId=${branchId}&Name=${res}`;
    return this.apiService.get(url).pipe(map((res: any) => res.items));
  }

  private getItinerary(product, isdomestic: Boolean): string {
    let itinerary = '';
    product?.flightOptions?.forEach((flightOption, index) => {
      itinerary += this.getDepartureAirportCode(product, flightOption, index)
        + this.getAirportCode(product.legs, flightOption.segments, false)
        + this.getArrowSign(product.flightOptions.length, index);
    });

    if (!isdomestic && product.searchInitRequest.tripType === "Return") {
      return product.searchInitRequest.segments[0].departureLocation.code + " - " + product.searchInitRequest.segments[0].arrivalLocation.code + " - " + product.searchInitRequest.segments[0].departureLocation.code;
    } else {
      return itinerary;
    }
  };

  private getDepartureAirportCode(flight: any, flightOption: any, index: number) {
    return index == 0 ? this.getAirportCode(flight.legs, flightOption.segments, true) + ' - ' : '';
  };

  private getAirportCode(legs, segments, From: boolean): string {
    if (From) {
      let firstFlightId = segments[0].flightIds[0];
      let firstLeg = legs.find(leg => leg.id == firstFlightId);
      return firstLeg.departureAirport.code;
    } else {
      let lastFlightId = segments[segments.length - 1].flightIds[segments[segments.length - 1].flightIds.length - 1];
      let lastLeg = legs.find(leg => leg.id == lastFlightId);
      return lastLeg?.arrivalAirport.code;
    }
  };

  private getArrowSign(length, index) {
    return length - 1 === index ? ' ' : ' - ';
  };

  transformBookings(bookings) {
    let booking = [];
    bookings.forEach((product, index) => {
      let data = {
        AgencyID: product.agencyId,
        AgencyName: product.agencyName,
        AgencyPointOfContactId: product.agencyPointOfContactId,
        ApprovalStatus: product.approvalStatus,
        BookingDate: this.datePipe.transform(new Date(product.bookingDate), 'dd MMM yyyy'),
        BookingFor: product.bookingFor,
        BookingId: product.bookingId,
        Itinerary: this.myTripsListing[index]?.itinerary,
        BookingStatus: product.bookingStatus,
        BranchId: product.branchId,
        BranchName: product.branchName,
        BranchPointOfContact: product.branchPointOfContact,
        BranchPointOfContactId: product.branchPointOfContactId,
        CorporateId: product.corporateId,
        CorporateName: product.corporateName,
        CreatedAt: product.createdAt,
        FacilitaorName: product.facilitaorName,
        CorporatePointOfContactId: product.corporatePointOfContactId,
        IsB2c: product.isB2c,
        IsDomestic: product.isDomestic,
        IsHoldBooking: product.isHoldBooking,
        IsPersonal: product.isPersonal,
        GstNo: product.corporateGstDetails?.gstNo,
        GstRegisteredName: product.corporateGstDetails?.gstRegisteredName
      }
      let consumer = this.getConsumers(product.consumers);
      Object.assign(data, ...consumer);
     booking.push(data);
    });

    return booking;
  }

  getConsumers(consumers) {
    let consumer = [];
    consumers.forEach((res, index) => {
      let data = {};
      let i = index+1;
      data['Consumer '+i] = res.firstName +' '+ res.middleName +' '+ res.lastName;
      data['Consumer '+i +' DOB'] = this.datePipe.transform(new Date(res.dateOfBirth), 'dd MMM yyyy');
      consumer.push(data);
    });
    return consumer;
  }
}
