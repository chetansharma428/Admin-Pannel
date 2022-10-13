import { Component, Input, OnInit } from '@angular/core';
import { FareOption, FlightOption, PaxFare, Product } from '../../../../lib/models/fetchApprovalResponse';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'vtech-ui-pricing-detail',
  templateUrl: './pricing-detail.component.html',
  styleUrls: ['./pricing-detail.component.scss']
})
export class PricingDetailComponent implements OnInit {

  @Input() cart: any
  displayAgencyEarnings: boolean;
  totalCost: number;
  refundAmount: number;
  cancellationAmount: number;
  isAgencyUser: boolean;
  flightTabs: any[];
  paymentMode: string;

  flightProduct: Product;
  flightOptions: FlightOption[];

  constructor(private _storageService: StorageService) { }

  ngOnInit() {
    this.isAgencyUser = this.checkIfAgencyUser();
    this.displayAgencyEarnings = false;
    this.paymentMode = this.cart.payment?.paymentMode || this.cart.payment?.mode;
    this.refundAmount = this.getTotalRefundAmount(this.cart.refunds);
    this.cancellationAmount = this.getTotalCancellationAmount(this.cart.cancellationCharges);
    this.flightProduct = this.cart.products.find(product => product.type.toLowerCase() === 'flight') || {} as Product;
    this.flightOptions = this.flightProduct.flightOptions;
    this.totalCost = this.cart.payment?.amount?.amount + this.getTotalServiceFee();
    this.flightTabs = this.getFlightTabs();
  }

  getTotalServiceFee(): number {
    let serviceFee = 0;
    try {
      if (this.paymentMode && this.paymentMode.toLowerCase() == "wallet")
        this.flightProduct.flightOptions.forEach(f => {
          serviceFee += f.fareOption?.otherRateComponents?.filter(o =>
            o.type.toLowerCase() == "servicefee")?.map(
              o => o.perSegmentTotalAmount ?? o.amount
            )?.reduce((sum, current) => sum + current, 0)
        })
    } catch (error) {
      console.error(error);
    }
    return serviceFee;
  }


  getAllConvFee() {
    let total: number = 0;
    if (this.paymentMode?.toLowerCase() !== 'wallet')
      this.flightProduct.flightOptions.forEach(fo => {
        total += fo.fareOption.otherRateComponents?.find(orc => orc.type?.toLowerCase() === 'conveniencefee')?.amount || 0;
      });
    return total;
  }

  getAllAddOnPricing() {
    let total: number = 0;
    this.flightProduct.addOns.forEach(addOn => total += addOn.amount.amount);
    return total;
  }

  checkIfAgencyUser(): boolean {
    let userType = this._storageService.getUserInfo()?.userType || null;
    return userType == 'agencyAdmin' || userType == 'agencyemployee';
  }

  getFlightTabs() {
    let segmentsCount = this.flightProduct.flightOptions.map(f => f.segments.length).reduce((sum, current) => sum + current, 0)
    return this.flightProduct.flightOptions.map(flightOption => {
      const seatBreakUp = this.getSeatBreakup(flightOption.id);
      const mealBreakUp = this.getMealBreakup(flightOption.id);
      const seatTotal = this.getAddOnTotal(seatBreakUp);
      const mealTotal = this.getAddOnTotal(mealBreakUp);
      return {
        label: this.getFlightOptionLabel(flightOption.id),
        costToAgency: flightOption.fareOption.aggregateFare.totalAmount.amount + seatTotal + mealTotal + this.getConvenienceFee(flightOption.fareOption),
        baseFare: flightOption.fareOption.aggregateFare.baseAmount.amount,
        taxes: flightOption.fareOption.aggregateFare.totalTaxes?.amount,
        discounts: flightOption.fareOption.aggregateFare.totalDiscounts?.amount,
        convenienceFee: this.getConvenienceFee(flightOption.fareOption),
        paxFare: {
          'Adult': this.getPaxFare(flightOption.fareOption.paxFares, 'adult'),
          'Child': this.getPaxFare(flightOption.fareOption.paxFares, 'child'),
          'Infant': this.getPaxFare(flightOption.fareOption.paxFares, 'infant')
        },
        taxBreakDown: this.getTaxBreakDown(flightOption.fareOption.paxFares),
        seats: seatBreakUp,
        seatTotal: seatTotal,
        meals: mealBreakUp,
        mealTotal: mealTotal,
        totalOtherCharges: seatTotal + mealTotal + this.getConvenienceFee(flightOption.fareOption),
        agencyEarnings: {
          serviceFee: (flightOption.fareOption.otherRateComponents?.find(orc => orc.type?.toLowerCase() === 'servicefee')?.perSegmentTotalAmount || 0) + this.getCancellationServiceFee(this.flightProduct, segmentsCount, flightOption),
          markUp: flightOption.fareOption.otherRateComponents?.find(orc => orc.type?.toLowerCase() === 'markup')?.perSegmentTotalAmount || 0,
          discount: flightOption.fareOption.otherRateComponents?.find(orc => orc.type?.toLowerCase() === 'discount')?.perSegmentTotalAmount || 0
        }
      }
    })
  }


  getCancellationServiceFee(product: Product, segmentsCount: number, flightOption: any): number {
    try {
      if (this.cart.bookingStatus.toLowerCase() == "invoiced")
        return 0;
      let serviceFee = 0;
      let segmentids: number[] = flightOption.segments?.map(s => s.segmentId) || [];
      let consumerConfirmationIds = product.consumerConfirmations.filter(c =>
        c.flightOptionId == flightOption.id
        && segmentids.includes(c.segmentId)
      )?.map(c => c.id);

      let cancellationCharges = this.cart.cancellationCharges?.filter(c => c.productId == product.id && c.consumerConfirmationIds.some(id => consumerConfirmationIds.includes(id)))

      cancellationCharges?.forEach(c => serviceFee += (c.cancellationType.toLowerCase() == "complete" ? (c.serviceFee?.amount ?? 0) / segmentsCount : c.serviceFee?.amount))

      return serviceFee;
    } catch (error) {
      console.error(error);
    }
    return 0;
  }


  getAddOnTotal(breakUp) {
    let total = 0;
    Object.keys(breakUp["adults"]).forEach(key => {
      total += parseInt(key) * breakUp['adults'][key];
    });
    Object.keys(breakUp["children"]).forEach(key => {
      total += parseInt(key) * breakUp['children'][key];
    });
    return total;
  }

  getMealBreakup(flightOptionId: string) {
    const allMeals = this.flightProduct.addOns.filter(addOn => addOn.type?.toLowerCase() === 'meal');
    const currFlightMeals = allMeals.filter(meal => meal.flightOptionId === flightOptionId);
    const breakUp = { adults: [], children: [] };
    currFlightMeals.forEach(meal => {
      const consumer = this.cart.consumers.find(cons => cons.id === meal.passengerId);
      if (consumer && consumer.type?.toLowerCase() === 'adult') {
        breakUp.adults.push({ price: meal.amount.amount })
      } else if (consumer && consumer.type?.toLowerCase() === 'child') {
        breakUp.children.push({ price: meal.amount.amount })
      }
    });
    return this.flattenBreakUp(breakUp);
  }

  getSeatBreakup(flightOptionId: string) {
    const allSeats = this.flightProduct.addOns.filter(addOn => addOn.type?.toLowerCase() === "seat") || [];
    const currFlightSeats = allSeats.filter(seat => seat.flightOptionId === flightOptionId);
    const breakUp = {
      adults: [],
      children: []
    };
    currFlightSeats.forEach(seat => {
      const consumer = this.cart.consumers.find(cons => cons.id === seat.passengerId);
      if (consumer && consumer.type?.toLowerCase() === 'adult') {
        breakUp.adults.push({ price: seat.amount.amount })
      } else if (consumer && consumer.type?.toLowerCase() === 'child') {
        breakUp.children.push({ price: seat.amount.amount })
      }
    });
    return this.flattenBreakUp(breakUp);
  }

  flattenBreakUp(breakUp: any) {
    const adultCounter = {};
    const childrenCounter = {};

    breakUp.adults.forEach(adult => {
      adultCounter[`${adult.price}`] = adultCounter[`${adult.price}`] ? adultCounter[`${adult.price}`] + 1 : 1
    });

    breakUp.children.forEach(child => {
      childrenCounter[`${child.price}`] = childrenCounter[`${child.price}`] ? childrenCounter[`${child.price}`] + 1 : 1
    });
    return {
      adults: adultCounter,
      children: childrenCounter
    }
  }

  keyvalue(key: string, value: number) {
    return parseInt(key) * value;
  }

  getTaxBreakDown(paxFares: PaxFare[]) {
    let cgst: number = 0;
    let sgst: number = 0;
    let igst: number = 0;
    let otherTaxesAmount: number = 0;
    paxFares.forEach(pf => {
      cgst += pf.fare.taxes.filter(f => {
        return f.code?.toLowerCase() === 'cgst'
      })?.map(t => t.amount * (pf.passengerInfo?.quantity ?? 1))?.reduce((prev, curr) => prev + curr, 0) || 0;

      sgst += pf.fare.taxes.filter(f => {
        return f.code?.toLowerCase() === 'sgst'
      })?.map(t => t.amount * (pf.passengerInfo?.quantity ?? 1))?.reduce((prev, curr) => prev + curr, 0) || 0;

      otherTaxesAmount += pf.fare.taxes.filter(f => {
        return f.code?.toLowerCase() !== 'sgst'
          && f.code?.toLowerCase() !== 'cgst'
          && f.code?.toLowerCase() != 'igst'
      })?.map(t => t.amount * (pf.passengerInfo?.quantity ?? 1))?.reduce((prev, curr) => prev + curr, 0) || 0;

      igst += pf.fare.taxes.filter(f => {
        return f.code?.toLowerCase() === 'igst'
      })?.map(t => t.amount * (pf.passengerInfo?.quantity ?? 1))?.reduce((prev, curr) => prev + curr, 0) || 0;
    });
    return {
      airlineCgst: cgst,
      airlineSgst: sgst,
      airlineIgst: igst,
      otherTaxes: otherTaxesAmount
    };
  }

  getConvenienceFee(fareOption: FareOption) {
    let fee: number = 0;
    if (this.paymentMode?.toLowerCase() !== 'wallet')
      fareOption.otherRateComponents?.forEach((c) => {
        if (c.type.toLowerCase() === 'conveniencefee') {
          fee += c.amount || 0;
        }
      })
    return fee;
  }

  getPaxFare(paxFares: PaxFare[], paxType: string) {
    return paxFares.find(pax => pax.passengerInfo.type.toLowerCase() === paxType) || null;
  }

  getTotalCancellationAmount(cancellationAmount: any[]) {
    let cancellationCharges = 0;
    if (cancellationAmount === null) {
      cancellationCharges = 0;
    } else {
      cancellationAmount.forEach(cancellation1 => {
        cancellationCharges += cancellation1.cancellationAmount.amount ?? 0;
      })
    }
    return cancellationCharges;
  }

  getTotalRefundAmount(refunds: any[]) {
    let refundAmount = 0;
    let refundArray = [];
    refunds.forEach(refund => {
      // console.log(refund);
      if (refund.status === "Successful") {
        refundArray.push(refund);
        // refundAmount += refund.amount.amount ?? 0;
      }
    })
    refundArray.forEach(refund1 => {
      refundAmount += refund1.amount.amount ?? 0;
    })
    return refundAmount;
  }

  toggleAgencyEarnings(value: boolean) {
    this.displayAgencyEarnings = value;
  }

  getFlightOptionLabel(flightOptionId: string) {
    const selectedFlightOption = this.flightOptions.find(flight => flight.id === flightOptionId);
    // handle international
    const selectedFlightIds: string[] = selectedFlightOption.segments[0].flightIds;
    const startLeg = this.flightProduct.legs.find(leg => leg.id === selectedFlightIds[0]);
    const endLeg = this.flightProduct.legs.find(leg => leg.id === selectedFlightIds[selectedFlightIds.length - 1]);

    if (!this.cart.isDomestic && this.cart.products[0].searchInitRequest.tripType == "Return") {
      return `${startLeg.departureAirport.code}-${endLeg.arrivalAirport.code}-${startLeg.departureAirport.code}`;
    } else {
      return `${startLeg.departureAirport.code}-${endLeg.arrivalAirport.code}`;
    }
  }
}
