import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddOn, Cart, ConsumerConfirmation, Leg, Passenger, Product, BookingInfo, Consumer, FlightOption, FrequentFlyerInfo, PaxFare, Segment } from '../../../../lib/models/fetchApprovalResponse';
import { CurrencyPipe } from '@angular/common';

import { StorageService } from '../../../../lib/services/storage-service/storage.service';
import { ApprovalListingTransForm } from './approvalListingTransform';
import * as moment from 'moment';

@Component({
  selector: 'vtech-ui-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements OnInit {

  @Input() cart: any
  flights: any[];
  isAgencyUser: boolean;
  isFareRulesOpen: boolean;
  flightDetails: any[];
  productTypeFo: any;
  intPassengers: Consumer[];
  cancelButton: boolean = true;
  overallBookingCancelStatus: boolean;
  flightOptionDetailsForFairDisplay: any;
  bookingID: any;
  isTravelDatePast: boolean;

  constructor(
    // private _editPnrDialog: MatDialog,
    // private _passengerCancellationDialog: MatDialog,
    // private _tripCancellationDialog: MatDialog,
    private storageService: StorageService,
    // private _flightCanellationService: FlightCancellationService,
    // private _dataErrorFlightCancellation: MatDialog
  ) { }

  ngOnInit() {
    this.isFareRulesOpen = false;
    this.flights = [];
    const userInfo = this.storageService.getUserInfo();
    // this.bookingID = this._flightCanellationService.bookingId;
    this.isAgencyUser = userInfo.userType === "agencyAdmin" || userInfo.userType === "agencyemployee";
    this.cart.products.forEach((product: Product) => {
      if (product.type === 'Flight') {
        this.productTypeFo = product.type;
        this.flights = this.getFlights(product, product.bookings);
        this.intPassengers = this.getProductPassengers();
      }
    });
    if (this.cart.bookingStatus === 'Cancelled') {
      this.overallBookingCancelStatus = true;
    } else {
      this.overallBookingCancelStatus = false;
    }
    this.getFlightDetails();
    let now = new Date();
    var departureDate = [];
    this.flights.forEach((element) => {
      departureDate.push(element.departureDate);
    });

    let travelDate = new Date(departureDate[0]);

    if (now.getTime() > travelDate.getTime()) {
      this.isTravelDatePast = true;
    } else {
      this.isTravelDatePast = false;
    }
  }

  private getFlightDetails() {
    this.flightDetails = [];
    this.flightDetails.push(ApprovalListingTransForm.fromRawResponse({
      cart: this.cart as any,
      carts: []
    })[0]?.productDetails?.flights[0] || {} as any);
  }

  private getFlights(product: Product, bookings: BookingInfo[]): any[] {
    const allFlights: any[] = [];
    product.flightOptions.forEach((flightOption: FlightOption, flightOptionIndex: number) => {
      flightOption.segments?.forEach((segment: Segment) => {
        const currLegs = this.getLegs(product.legs, segment) ?? [];
        let startLeg = currLegs.find(leg => leg.id === segment.flightIds[0]);
        let endLeg = currLegs.find(leg => leg.id === segment.flightIds[segment.flightIds.length - 1]);
        allFlights.push({
          cartId: this.cart.id,
          productId: product.id,
          id: flightOption.id,
          legs: currLegs,
          flightImage: currLegs[0].airLineLogoUrl,
          from: `${startLeg.departureAirport.name || ''} (${startLeg.departureAirport.code})`,
          departureTerminal: startLeg.departureTerminal || '',
          to: `${endLeg.arrivalAirport.name || ''} (${endLeg.arrivalAirport.code})`,
          arrivalTerminal: endLeg.arrivalTerminal || '',
          flightNo: this.getFlightNo(currLegs),
          flightName: this.getFlightName(currLegs),
          flightDuration: minsToHours(this.getTotalMins(segment)),
          stops: currLegs.length === 1 ? "Non Stop" : currLegs.length - 1 === 1 ? "1 Stop" : currLegs.length - 1 + " Stops",
          status: bookings?.find(booking => booking.flightOptionId === flightOption.id)?.status ?? '',
          arrivalDate: moment(segment.arrivalDateTime).format("ddd, DD MMM'YY"),
          arrivalTime: moment(segment.arrivalDateTime).format('HH:mm'),
          departureDate: moment(segment.departureDateTime).format("ddd, DD MMM'YY"),
          departureTime: moment(segment.departureDateTime).format('HH:mm'),
          pnr: segment.pnr,
          segmentId: segment.segmentId,
          aircraft: this.getAircraftType(currLegs),
          fareType: flightOption.fareOption.fareType,
          cabinType: this.getCabinType(flightOption.fareOption.paxFares),
          classOfService: this.getClassOfService(flightOption),
          passengers: this.getPassengers(product.consumerConfirmations, flightOption.id, this.cart.consumers),
          checkInBaggage: product.baggages.find(b => b.type?.toLowerCase() === 'checkin')?.description || 'NA',
          cabinBaggage: product.baggages.find(b => b.type?.toLowerCase() === 'cabin')?.description || 'NA',
          flightBookingStatus: this.getBookingStatusForFlight(product.consumerConfirmations, flightOption.id, segment.pnr),
          stopsOvers: this.getStopInformation(segment, currLegs),
          isReturnFlight: flightOptionIndex === 1,
          csrPnr: segment.csrPNR,
          consumerConfirmations: product.consumerConfirmations,
          bookings: product.bookings
        });
      })
    });
    return allFlights;
  }



  getClassOfService(flightOption: FlightOption) {
    return flightOption?.fareOption?.paxFares?.[0].fareBasisDetails?.map(f => f.classOfService)?.join() || "NA";
  }

  private getStopInformation(segment: Segment, currLegs: any[]): string {
    let layovers: string[] = []
    const flightIds = segment.flightIds;
    for (let i = 0; i < flightIds.length - 1; i++) {
      const currFlight = currLegs.find((leg: any) => leg.id === flightIds[i]);
      const layoverAirportName = `${currFlight.arrivalAirport.name} (${currFlight.arrivalAirport.code})`;
      const duration = segment.layovers.find((layover) => layover.arrivingFlightId === flightIds[i])?.durationMinutes ?? 0;
      layovers.push(`${layoverAirportName} | ${minsToHours(duration)}`);
    }
    return layovers.join(',');
  }

  private getBookingStatusForFlight(consumerConfirmations: ConsumerConfirmation[], flightOptionId: string, pnr: string) {
    let status = 'TICKETED';
    const currConsumerConfirmations = consumerConfirmations.filter(cc => cc.flightOptionId === flightOptionId);
    currConsumerConfirmations.forEach(cc => {
      if (cc.isCancelled)
        status = 'CANCELLED';
      if (!cc.ticketNumber)
        status = 'NOT TICKETED';
      // if (!cc.ticketNumber && !pnr) {
      //   status = 'FAILED';
      // }
    })
    return status
  }

  getProductPassengers(): Consumer[] {
    const finalConsumers: Consumer[] = [];
    const nonPrimaryConsumers: Consumer[] = [];
    if (!(!!this.cart.isDomestic)) {
      let consumerIds = this.cart.products?.find(p => p.type.toLowerCase() == "flight")?.consumerIds;;

      consumerIds.forEach(cid => {
        var c: Consumer = this.cart.consumers.find(consumer => consumer.id === cid);
        let finalConsumerCheck = finalConsumers.findIndex(res => res.id === cid);
        let nonPrimaryConsumerCheck = nonPrimaryConsumers.findIndex(res => res.id === cid);

        if (c.isPrimary && finalConsumerCheck == -1) {
          finalConsumers.push(c);
        } else if (!c.isPrimary && nonPrimaryConsumerCheck === -1) {
          nonPrimaryConsumers.push(c);
        }
      });
    }
    return [...finalConsumers, ...nonPrimaryConsumers];
  }

  private getPassengers(consumerConfirmations: ConsumerConfirmation[], flightOptionId: string, consumers: Consumer[]): Consumer[] {
    const finalConsumers: Consumer[] = [];
    const nonPrimaryConsumers: Consumer[] = [];
    const consumerIds = consumerConfirmations.filter((cc: ConsumerConfirmation) => { return cc.flightOptionId === flightOptionId; }).map(cc => cc.consumerId);

    consumerIds.forEach(cid => {
      var c: Consumer = consumers.find(consumer => consumer.id === cid);
      let finalConsumerCheck = finalConsumers.findIndex(res => res.id === cid);
      let nonPrimaryConsumerCheck = nonPrimaryConsumers.findIndex(res => res.id === cid);

      if (c.isPrimary && finalConsumerCheck == -1) {
        finalConsumers.push(c);
      } else if (!c.isPrimary && nonPrimaryConsumerCheck === -1) {
        nonPrimaryConsumers.push(c);
      }
    });

    return [...finalConsumers, ...nonPrimaryConsumers];
  }

  private getCabinType(paxFares: PaxFare[]): string {
    const allCabins = paxFares.map(paxFare => paxFare.fareBasisDetails?.map(fareBasisDetail => fareBasisDetail.cabinType))
    return allCabins.length > 0 ? [...new Set(allCabins[0])].join(' |') : '';
  }

  private getAircraftType(legs: any[]): string {
    return legs.length === 1 ? legs[0].aircraftType : legs.map(leg => leg.aircraftType).join(' |');
  }

  static getAirport(legs: Leg[], segments: Segment[], From: boolean): string {
    if (From) {
      let firstFlightId = segments[0].flightIds[0];
      let firstLeg = legs.find(leg => leg.id == firstFlightId);
      return firstLeg.departureAirport.code;
    } else {
      let lastFlightId = segments[segments.length - 1].flightIds[segments[0].flightIds.length - 1];
      let lastLeg = legs.find(leg => leg.id == lastFlightId);
      return lastLeg.arrivalAirport.code;
    }
  }

  private getTotalMins(segment: Segment): number {
    return segment.durationMinutes;
    // let totalTime = 0;
    // segments.forEach((segment: Segment) => { totalTime += segment.durationMinutes });
    // return totalTime;
  }

  private getFlightNo(legs: any[]): string {
    const numbers = legs.map(leg => leg.carrier + ' ' + leg.number)
    return numbers.length === 0 ? numbers[0] : numbers.join(' | ');
  }

  private getFlightName(legs: any[]): string {
    return this.getAirlineName(legs?.map(leg => leg.carrier)[0]) ?? ''
  }

  private getAirlineName(airlineCode: string) {
    switch (airlineCode?.toLowerCase()) {
      case 'ai': return 'Air India'
      case 'g8': return 'Go First'
      case 'i5': return 'AirAsia'
      case '6e': return 'Indigo'
      case 'sg': return 'SpiceJet'
      case 'uk': return 'Vistara'
      case 'ac': return 'Air Canada'
      case 'af': return 'Air France'
      case 'ba': return 'British Airways'
      case 'cx': return 'Cathay Pacific'
      case 'dl': return 'Delta'
      case 'ek': return 'Emirates'
      case 'ey': return 'Etihad  Airways'
      case 'kl': return 'KLM'
      case 'lh': return 'Lufthansa'
      case 'od': return 'Malindo Air'
      case 'ra': return 'Nepal Airlines'
      case 'qf': return 'Qantas'
      case 'qr': return 'Qatar Airways'
      case 'sq': return 'Singapore Airlines'
      case 'ul': return 'SriLankan'
      case 'lx': return 'SWISS'
      case 'tg': return 'THAI'
      case 'tk': return 'Turkish Airlines'
      case 'ua': return 'United'
      case 'vs': return 'Virgin Atlantic'
    }
  }

  private getLegs(legs: Leg[], segment: Segment): any[] {
    const flightIds = segment.flightIds; //Need to handle international scenario
    const legsData = [];
    flightIds.forEach((flightId) => {
      legsData.push(legs.find(leg => leg.id == flightId))
    });
    return legsData;
  }

  private parseIntFrequentFlyers(frequentFlyerInfo: FrequentFlyerInfo[]): string {
    if (frequentFlyerInfo && frequentFlyerInfo.length > 0) {
      return frequentFlyerInfo.length === 1 ? frequentFlyerInfo[0].number : frequentFlyerInfo.map(ff => ff.number).join(',');
    }
    return '-';
  }

  private parseFrequentFlyers(frequentFlyerInfo: FrequentFlyerInfo[]): string {
    if (frequentFlyerInfo && frequentFlyerInfo.length > 0) {
      return frequentFlyerInfo.length === 1 ? frequentFlyerInfo[0].number : frequentFlyerInfo.map(ff => ff.number).join(',');
    }
    return '-';
  }

  private parseIntInvoiceNumber(consumerId: string): string {
    const currProduct = this.cart.products.find(product => product.type.toLowerCase() == 'flight');
    const currConsumerConfirmations = currProduct.consumerConfirmations.filter(cc => cc.consumerId === consumerId);
    if ((currConsumerConfirmations || []).length > 0) {
      return currConsumerConfirmations[0].xlInvoiceNumber ?? '-';
    }
    return '-';
  }

  private parseInvoiceNumber(consumerId: string, flightId: string, segmentId: number): string {
    const currProduct = this.cart.products.find(product => product.flightOptions.find(flightOption => flightOption.id === flightId));
    const currConsumer = currProduct.consumerConfirmations.find(cc => cc.consumerId === consumerId && cc.segmentId === segmentId);
    return currConsumer.xlInvoiceNumber || '-';
  }

  private parseTicketNumber(consumerId: string, flightId: string, segmentId: number): string {
    const currProduct = this.cart.products.find(product => product.flightOptions.find(flightOption => flightOption.id === flightId));
    const currConsumer = currProduct.consumerConfirmations.find(cc => cc.consumerId === consumerId && cc.segmentId === segmentId);
    return currConsumer.ticketNumber || '-';
  }

  private parseIntTicketNumber(consumerId: string): string {
    const currProduct = this.cart.products.find(product => product.type.toLowerCase() == 'flight');
    const currConsumerConfirmations = currProduct.consumerConfirmations.filter(cc => cc.consumerId === consumerId);
    if ((currConsumerConfirmations || []).length > 0) {
      return currConsumerConfirmations[0].ticketNumber ?? '-';
    }
    return '-';
  }

  private getIntApprovalCode(): string {
    const currProduct = this.cart.products.find(product => product.type.toLowerCase() == 'flight');
    return currProduct.approvalCode || '-';
  }

  private getApprovalCode(flightId: string): string {
    const currProduct = this.cart.products.find(product => product.flightOptions.find(flightOption => flightOption.id === flightId));
    return currProduct.approvalCode || '-';
  }

  private getSeat(consumerId: string, flightId: string) {
    const currSeat = this.cart.products.find(pro => pro.type?.toLowerCase() === 'flight')?.addOns.find(addOn => addOn.type?.toLowerCase() === 'seat' && addOn.flightOptionId === flightId && addOn.passengerId === consumerId);
    return currSeat?.id || '-';
  }

  private getMeal(consumerId: string, flightId: string) {
    const confirmedAddonIds = this.cart.products.find(pro => pro.type?.toLowerCase() === 'flight')?.consumerConfirmations?.find(c => c.flightOptionId === flightId)?.flightAddOnIds;
    const currMeal = this.cart.products.find(pro => pro.type?.toLowerCase() === 'flight')?.addOns.find(addOn => addOn.type?.toLowerCase() === 'meal' && addOn.flightOptionId === flightId && addOn.passengerId === consumerId && confirmedAddonIds.includes(addOn.id));
    return currMeal?.id || '-';
  }

  private parsePaxAddOns(consumerId: string, flightId: string, segmentId: number, type: string): any {
    const currProduct = this.cart.products.find(product => product.flightOptions.find(flightOption => flightOption.id === flightId));
    const currConsumer = currProduct.consumerConfirmations.find(cc => cc.consumerId === consumerId && cc.segmentId === segmentId);
    const flightIds = currProduct?.flightOptions?.find(option => option?.id == flightId).segments?.find(segment => segment?.segmentId == segmentId)?.flightIds || [];
    return this.getAddOns(currProduct?.legs, flightIds, currConsumer?.consumerId, currProduct?.addOns, type, currConsumer?.flightAddOnIds);
  }

  private getAddOns(legs: Leg[], flightIds: string[], passengerId: string, addOns: AddOn[], type: string, confirrmedAddOnIds: string[]): { firstValue: string, secondValue: string, price: number }[] {
    let addOnDetails: { firstValue: string, secondValue: string, price: number }[] = [];
    flightIds.forEach(id => {
      let leg = legs.find(leg => leg.id == id);
      let filterAddOn = addOns?.filter(addon => addon?.flightLegId == leg.id && addon.passengerId == passengerId && addon.type == type && confirrmedAddOnIds?.includes(addon.id));
      filterAddOn.forEach(filterData => {
        addOnDetails.push({
          firstValue: leg?.departureAirport?.code + " - " + leg?.arrivalAirport?.code,
          secondValue: filterData?.description,
          price: filterData?.amount?.amount
        })
      });
    })
    return addOnDetails || [];
  }

  parseIntPaxAddOns(consumerId: string, type: string): any {
    const currProduct = this.cart.products.find(product => product.type.toLowerCase() == 'flight');
    const flightAddOnIds = currProduct.consumerConfirmations.filter(cc => cc.consumerId === consumerId)?.map(cc => (cc.flightAddOnIds || []))?.flat();
    let flightIds = currProduct?.legs?.map(l => l.id);
    return this.getAddOns(currProduct?.legs, flightIds, consumerId, currProduct?.addOns, type, flightAddOnIds);
  }


  openIntEditPnrOverlay() {
    // const currProduct = this.cart.products.find(product => product.type.toLowerCase() == 'flight');
    // let tripLabel = this.flights[0].from.split('(')[0] + '-' +  this.flights.map(f => f.to.split('(')[0]).join('-');
    // let pnr = this.flights.map( f  => f.pnr)[0];
    // this._editPnrDialog.open(EditPnrIntlOverlayComponent, {
    //   data: {
    //     pnr: pnr,
    //     csrPnr: null,
    //     segmentId: 1,
    //     productId: currProduct.id,
    //     cartId: this.cart.id,
    //     consumerConfirmations: currProduct.consumerConfirmations,
    //     bookings: currProduct.bookings,
    //     passengers: this.getProductPassengers(),
    //     tripLabel: tripLabel
    //   }
    // });
  }
  openIntTripCancellationOverlay() {

  }

  openEditPnrOverlay(flightId: string, pnr: string, csrPnr: string, segmentId: string, productId: string, cartId: string, consumerConfirmations: ConsumerConfirmation[], bookings: BookingInfo[], passengers: Consumer[]) {
    // let selectedFlight = this.flights.find(f => f.id == flightId);
    // this._editPnrDialog.open(EditPnrOverlayComponent, {
    //   data: {
    //     pnr: pnr,
    //     csrPnr: csrPnr,
    //     showCsrPnr: true,
    //     segmentId: segmentId,
    //     productId: productId,
    //     cartId: cartId,
    //     consumerConfirmations: consumerConfirmations,
    //     bookings: bookings,
    //     passengers: passengers,
    //     tripLabel: `${selectedFlight.from} - ${selectedFlight.to}`
    //   }
    // });
  }

  openPassengerCancellationOverlay(passenger: Passenger, flightId: string) {
  }

  openTripCancellationOverlay(flightId: string, segmentId: string, productId: string, cardId: string) {
    // let dialogRef =  this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //   data: {
    //     showProgress: true
    //   }
    // });
    // this._flightCanellationService.bookingId = this.bookingID;
    // let cartId = cardId;
    // let flightIdVl = flightId;
    // let segmentIDS = [];
    // segmentIDS.push(segmentId);
    // let productIdVD = productId;
    // let ProductType = this.productTypeFo;
    // let cancellationType = "SpecificSegments";
    // this._flightCanellationService.particularFlightSegmentCancellation(productIdVD, cancellationType, ProductType, cartId, segmentIDS).subscribe((res) => {
    //   dialogRef.close();
    //   let showFailurePopup = false;
    //   let segmentMen = (res.SegmentCancellationCharges || []).forEach(charges => {
    //     if (charges === null) {
    //       showFailurePopup = true;
    //     } else if (charges.ConvenienceFees.amount === null) {
    //       showFailurePopup = true;
    //     }
    //   });
    //   if (showFailurePopup) {
    //     this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //       disableClose: true,
    //       data: {
    //         showError: true
    //       }
    //     });
    //   } else {
    //     this._flightCanellationService.cancellationData = res;
    //     this._tripCancellationDialog.open(FlightCancellationOverlayComponent, { disableClose: true,
    //       data: {
    //       showError: true
    //     } });
    //     this._flightCanellationService.productId = productIdVD;
    //     this._flightCanellationService.cart = this.cart;
    //     this._flightCanellationService.flightDetails = this.cart.products[0];
    //     this._flightCanellationService.cardId = cartId;
    //     this._flightCanellationService.segmentIds = segmentIDS;
    //     this._flightCanellationService.cancellationType = cancellationType;
    //     this._flightCanellationService.productType = ProductType;
    //   }
    // },
    // (error) => {
    //   dialogRef.close();
    //   this._dataErrorFlightCancellation.open(DataErrorFlightCancellationOverlayComponent, {
    //     disableClose: true,
    //     data : {
    //       showError: true
    //     }
    //   });
    //   }
    // )

  }

  openPanel(id: string) {
    // this.cart.products.filter((product) => {
    //   product.flightOptions.filter((flight) => {
    //     if (flight.id === id) {
    //       this.flightOptionDetailsForFairDisplay = flight;
    //     }
    //   })
    // })
    // this._flightCanellationService.flightOptionDetailsforFair = this.flightOptionDetailsForFairDisplay;
    // this._flightCanellationService.segmentId = null;
    // this._flightCanellationService.flightOptionId = id;
    // this.isFareRulesOpen = true;
  }

  onClosesidecard(isCloseSideCard) {
    if (isCloseSideCard) {
      this.isFareRulesOpen = false;
    }
  }
}

export const minsToHours = (mins: number): string => {
  const hours = Math.trunc(mins / 60);
  const minuites = mins % 60;
  return (hours < 10 ? '0' + hours : hours) + " h " + (minuites < 10 ? '0' + minuites : minuites) + " m";
}
