// import { Segment } from './../result-home/views/results';
import { AnyPtrRecord } from 'dns';
import * as moment from 'moment';
import { AddOn, Cart, ConsumerConfirmation, Leg, Passenger, Product, BookingInfo, Consumer, FlightOption, FrequentFlyerInfo, PaxFare, Segment } from '../../../../lib/models/fetchApprovalResponse';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';

export class ApprovalListingTransForm {
  static approvalListing: AnyPtrRecord[] = [];
  constructor(public storageService: StorageService) { }
  public static fromRawResponse(response: any): any[] {
    this.approvalListing = [];
    if (response?.cart) {
      response.carts = [];
      response.carts.push(response.cart)
    }
    response.carts.forEach((list) => {

      if (list.products?.length) {
        list.products.forEach((product) => {
          if (product.type == "Flight") {
            let aList: any = {
              cartId: list.id,
              itinerary: this.getItinerary(product, list.isDomestic),
              travelDate: product.travelDate ? new Date(product.travelDate) : product.travelDate,
              bookingDate: list.bookingDate ? new Date(list.bookingDate) : list.bookingDate,
              bookingId: list.bookingId ? list.bookingId : '',
              bookingFor: this.getPrimaryUserName(list.consumers),
              requestedBy: list.facilitatorId ? list.facilitatorId : '',
              status: list.approvalStatus,
              productDetails: this.getFlightDetails(product),
              passengerDetails: this.getpassengerDetails(list),
              searchToken: product.searchToken,
              tripType: product.searchInitRequest.tripType,
              isDomestic : list.isDomestic
            }
            this.approvalListing.push(aList);
          }
        })
      }
    })
    return this.approvalListing;
  }

  private static getPrimaryUserName(consumers: Consumer[]) {
    let primaryUser = consumers.find(consumer => consumer.isPrimary == true);
    return primaryUser ? primaryUser.firstName + ' ' + primaryUser.middleName + ' ' + primaryUser.lastName : '';
  }

  private static getItinerary(product: Product, isdomestic: Boolean) {
    let itinerary = '';
    product?.flightOptions?.forEach((flightOption, index) => {
      itinerary += this.getDepartureAirportCode(product, flightOption, index)
        + this.getAirportCode(product.legs, flightOption.segments, false)
        + this.getArrowSign(product.flightOptions.length, index);
    });

    if(!isdomestic && product.searchInitRequest.tripType === "Return") {
      return product.searchInitRequest.segments[0].departureLocation.code + " - " + product.searchInitRequest.segments[0].arrivalLocation.code +  " - " + product.searchInitRequest.segments[0].departureLocation.code;
    } else {
      return itinerary;
    }
  }

  private static getDepartureAirportCode(flight: any, flightOption: any, index: number) {
    return index == 0 ? this.getAirportCode(flight.legs, flightOption.segments, true) + ' - ' : '';
  }

  private static getArrowSign(length, index) {
    return length - 1 === index ? ' ' : ' - ';
  }

  static getpassengerDetails(list: Cart): any[] {
    let passengerDetails: any[] = [];
    list.products.forEach((product) => {
      var meals, seats, frequentFlyerNumbers;
      product.consumerIds.forEach((consumer) => {
        let consumerData: Consumer = list.consumers.find((user) => user.id == consumer);
        product.flightOptions.forEach((option) => {
          option.segments.map(segment => {
            frequentFlyerNumbers = this.getFrequentFlyerNumbers(product.legs, segment.flightIds, consumerData)
            meals = this.getAddOns(product.legs, segment.flightIds, consumer, product.addOns, "Meal");
            seats = this.getAddOns(product.legs, segment.flightIds, consumer, product.addOns, "Seat");
          })

          let passengerDetail: any = {
            flightOptionId: option?.id,
            passengerName: consumerData ? consumerData?.firstName + ' ' + consumerData?.middleName + ' ' + consumerData?.lastName : '',
            passengerType: consumerData ? consumerData?.type : '',
            frequentFlyerNumber: frequentFlyerNumbers,
            approvalCode: product?.approvalCode,
            seat: seats ?? "",
            meals: meals || "",
          }

          passengerDetails.push(passengerDetail);
        });
      });
    })
    return passengerDetails;
  }
  static getFrequentFlyerNumbers(legs: Leg[], flightLegId: string[], consumerData: Consumer): any {
    let parsedFrequentFlyerNumbers: {firstValue: string}[] = [];
    var frequentFlyerInfo: FrequentFlyerInfo;
    flightLegId.forEach(id => {
    let leg = legs.find(leg => leg.id == id);
    frequentFlyerInfo = consumerData?.frequentFlyerInfos?.find(frequentFlyerInfo => frequentFlyerInfo.carrier === leg.carrier);
    if(frequentFlyerInfo){
      let isffNumberAlreadyExists = parsedFrequentFlyerNumbers.some(el => el.firstValue === frequentFlyerInfo?.number);
      if(!isffNumberAlreadyExists){
        parsedFrequentFlyerNumbers.push({
          firstValue: frequentFlyerInfo.number
        });
      }
    }
   });
    return parsedFrequentFlyerNumbers;
  }
  static getAddOns(legs: Leg[], flightLegId: string[], passengerId: string, addOns: AddOn[], type: string): {firstValue: string, secondValue: string, price: number}[] {
    let addOnDetails: {firstValue: string, secondValue: string, price: number}[] = [];
    flightLegId.forEach(id => {
      let leg = legs.find(leg => leg.id == id);
      let filterAddOn = addOns.filter(addon => addon.flightLegId == leg.id && addon.passengerId == passengerId && addon.type == type);
      filterAddOn.forEach(filterData => {
        addOnDetails.push({
          firstValue: leg?.departureAirport?.code + " - " + leg?.arrivalAirport?.code,
          secondValue: filterData?.description,
          price: filterData?.amount?.amount
        })
      });
    });
    return addOnDetails;
  }

  private static getFlightDetails(product: Product): any {
    let productDetails: any;
    let flightDetailsView: any[] = [];
    let segments = [];

    product?.flightOptions?.forEach((flightOption, index) => {
      flightOption?.segments.forEach(segment => {
        const currLegs = this.getLegs(product.legs, segment) ?? [];
        let startLeg = currLegs.find(leg => leg.id === segment.flightIds[0]);
        let endLeg = currLegs.find(leg => leg.id === segment.flightIds[segment.flightIds.length - 1]);
        let flightList = {
          id: flightOption.id,
          isCorporateSelected: flightOption.fareOption.fareType == "Corporate",
          retailCost: this.getCostByFareType(flightOption.fareOption, 'Retail')?.replace(/\.00/,''),
          corporateCost: this.getCostByFareType(flightOption.fareOption, 'Corporate')?.replace(/\.00/,''),
          fares: [flightOption.fareOption],
          fareRule: this.getFareRule(flightOption),
          flightImage: currLegs[0]?.airLineLogoUrl || './assets/images/imagenotfound.png',
          flightNo: this.getFlightNo(currLegs),
          segmentID: segment.segmentId,
          arrivalTime: moment(segment.arrivalDateTime).format('HH:mm'),
          departureTime: moment(segment.departureDateTime).format('HH:mm'),
          flightDuration: this.minsToHours(segment?.durationMinutes),
          stops: currLegs.length === 1 ? "Non Stop" : currLegs.length - 1 === 1 ? "1 Stop" : currLegs.length - 1 + " Stops",
          from: `${startLeg.departureAirport.name} (${startLeg.departureAirport.code})`,
          to: `${endLeg.arrivalAirport.name} (${endLeg.arrivalAirport.code})`,
          stopOvers: this.getStopOvers(segment, currLegs),
          legs: currLegs,
          isReturnFlight: index == 0 ? false : true,
          arrivalDate: moment(endLeg.arrivalDateTime),
          departureDate: moment(startLeg.departureDateTime)
        } as any
        flightDetailsView.push(flightList)
      });
    })

    flightDetailsView.map((flight,index)=> {
      segments[index] = {
          isReturnFlight : flight.isReturnFlight,
          segmentId : flight.id,
          segmentMainId: flight.segmentID,
          legs: flight.legs,
          flightDuration : flight.flightDuration,
          layovers : [],
          stops : flight.stops,
          stopOvers: flight.stopOvers,
          departureTime : flight.departureTime,
          departureDate : moment(flight.departureDate).format("ddd, DD MMM"),
          departureDateFullYear : moment(flight.departureDate).format("ddd, DD MMM 'YY"),
          arrivalTime : flight.arrivalTime,
          arrivalDate : moment(flight.arrivalDate).format("ddd, DD MMM"),
          arrivalDateFullYear : moment(flight.arrivalDate).format("ddd, DD MMM 'YY"),
          corporateCost : flight.corporateCost?.replace(/\.00/,''),
          retailCost : flight.retailCost?.replace(/\.00/,''),
          fares : flight.fares,
          fareType: flight.fareType
      }
    })
    flightDetailsView.map((flight)=>{
      flight.segments = segments;
    })

    productDetails = {
      flights:flightDetailsView,
      productId: product.id
    }
      return productDetails;
  }
  static getSegments(){
    return{}
  }
  static getFareRule(flightOption: FlightOption): any {
    let fareRule: any;
    fareRule = {
      fareBasisRules: flightOption.fareBasisRules,
      fareId: flightOption.fareOption.id,
      resultItemId: flightOption.id
    }
    return fareRule;
  }

  private static getCostByFareType(fareOptions: any, faretype: string): string {
    return fareOptions.fareType == faretype ? fareOptions.aggregateFare.totalAmount.amount.toString() : '0';
  }

  private static getFlightNo(legs: any[]): string {
    const numbers = legs.map(leg => leg.carrier + ' ' + leg.number)
    return numbers.length === 0 ? numbers[0] : numbers.join(' | ');
  }

  static minsToHours(mins: number): string {
    const hours = Math.trunc(mins / 60);
    const minuites = mins % 60;
    return (hours < 10 ? '0' + hours : hours) + " h " + (minuites < 10 ? '0' + minuites : minuites) + " m";
  }

  static getAirportCode(legs: Leg[], segments: Segment[], From: boolean): string {
    if (From) {
      let firstFlightId = segments[0].flightIds[0];
      let firstLeg = legs.find(leg => leg.id == firstFlightId);
      return firstLeg.departureAirport.code;
    } else {
      let lastFlightId = segments[segments.length - 1].flightIds[segments[0].flightIds.length - 1];
      let lastLeg = legs.find(leg => leg.id == lastFlightId);
      return lastLeg?.arrivalAirport.code;
    }
  }

  private static getStopOvers(segment: Segment, currLegs: any[]): string {
    let layovers: string[] = []
    const flightIds = segment.flightIds;
    for (let i = 0; i < flightIds.length - 1; i++) {
      const currFlight = currLegs.find((leg: any) => leg.id === flightIds[i]);
      const layoverAirportName = `${currFlight.arrivalAirport.name} (${currFlight.arrivalAirport.code})`;
      const duration = segment.layovers.find((layover) => layover.arrivingFlightId === flightIds[i])?.durationMinutes ?? 0;
      layovers.push(`${layoverAirportName} | ${this.minsToHours(duration)}`);
    }
    return layovers.join(',');
  }

  static getLegs(legs: Leg[], segments: Segment): any[] {
    let flightIds = segments.flightIds; //Need to handle international scenario
    let legsData = [];
    flightIds.forEach((flightId) => {
      legsData.push(legs.find(leg => leg.id == flightId))
    });
    return legsData;
  }
}
