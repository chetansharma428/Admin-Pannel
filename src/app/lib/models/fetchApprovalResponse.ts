export interface Airport {
  locationType: string;
  code: string;
}
export interface BookingInfo {
  providerConfirmationNumber: string;
  airlineConfirmationNumber: string;
  flightOptionId: string;
  segmentId: string;
  supplierBookingId: string;
  status: string;
}

export interface Consumer {
  id: string;
  type: string;
  gender: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth?: Date;
  isPrimary: boolean;
  contactInfo: ContactInfo;
  passport: Passport;
  frequentFlyerInfos?: FrequentFlyerInfo[];
}

export interface ContactInfo {
  phones: string[];
  addresses: Address[];
  primaryEmail: string;
  alternateEmails?: string[];
}
export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}


export interface Passport {
  number: string;
  placeOfIssue: string;
  dateOfIssue: Date;
  expirationDate: Date;
  nationality: string;
  visaDetails: VisaDetail[];
}
export interface VisaDetail {
  number: string;
  placeOfIssue: string;
  dateOfIssue: Date;
  applicableCountry: string;
  type: string;
}

export interface FrequentFlyerInfo {
  carrier: string;
  number: string;
}


export interface FlightOption {
  id: string;
  segments: Segment[];
  fareOption: FareOption;
  fareBasisRules?: Array<any>;
  providerId?: string;
  fareType?: string;
  segmentsKey?: string;
}

export interface HotelOption {
  id: string;
  segments: Segment[];
  fareOption: FareOption;
  fareBasisRules?: Array<any>;
  providerId?: string;
  fareType?: string;
  segmentsKey?: string;
  hotelOptionRate?: any;
}

export interface Segment {
  segmentId: number;
  pnr?: any;
  pnrStatus?: string;
  flightIds: string[];
  layovers: any[];
  durationMinutes: number;
  departureDateTime?: string;
  arrivalDateTime?: string;
  csrPNR?: string;
}

export class FareOption {
  public aggregateFare: Fare;
  public fareType: string;
  public platingCarrier: string;
  public platingCarrierTicketable: boolean;
  public paxFares: Array<PaxFare>;
  public tags: Array<string>;
  public accountCodes: Array<string>;
  public corporateCodes: Array<string>;
  public id: string;
  public providerId: string;
  public segmentsKey: string;
  public outOfPolicy?: boolean;
  public otherRateComponents?: Array<any>;
}

export interface Employee {
  id: string;
  code: string;
  designation: string;
  project: string;
  department: string;
  firstName?: string;
  lastName?: string;
}

export interface AggregateFare {
  baseAmount: any;
  totalAmount: any;
  taxes: any[];
  fees: any[];
  discounts: any[];
  penalties: any[];
  totalTaxes: any;
  totalDiscounts?: any;
  totalFees?: any;
}

export interface PassengerInfo {
  type: string;
  quantity: number;
}

export interface Tax {
  code: string;
  type: string;
  description?: any;
  currency: string;
  amount: number;
}

export interface Penalty {
  amountType: string;
  penaltyType: string;
  code?: any;
  type: string;
  description?: any;
  currency: string;
  amount: number;
}

export interface Fare {
  baseAmount: any;
  totalAmount: any;
  taxes: Tax[];
  fees: any[];
  discounts: any[];
  penalties: Penalty[];
  totalTaxes: any;
  totalDiscounts?: any;
  totalFees?: any;
}

export interface FareFamily {
  name?: any;
  description?: any;
}

export interface FareBasisDetail {
  flightCode: string;
  cabinType: string;
  classOfService: string;
  code: string;
  fareFamily: FareFamily;
  baggageCode: string;
}

export interface PaxFare {
  passengerInfo: PassengerInfo;
  fare: Fare;
  fareBasisDetails: FareBasisDetail[];
}

export interface Leg {
  id: string;
  code: string;
  airLineLogoUrl: string;
  airlineName?: string;
  number: string;
  carrier: string;
  operatingCarrier: string;
  ticketingCarrier?: any;
  codeShareText: string;
  aircraftType: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  arrivalDateTime: Date;
  departureDateTime: Date;
  arrivalTerminal?: any;
  departureTerminal?: any;
  stops: any[];
  durationMins: number;
  seatsRemaining?: any;
  distanceKm: number;
}

export interface Baggage {
  code: string;
  description?: any;
  quantity: number;
  weightKg?: any;
  type? : string;
}

export interface AddOn {
  flightLegId: string;
  passengerId: string;
  type: string;
  id: string;
  description: string;
  amount: any;
  flightOptionId?: string;
}

export interface Segment2 {
  departureLocation: Airport;
  arrivalLocation: Airport;
  travelDate: Date;
  cabinType: string;
  bookingClassPreference?: any;
}

export interface Passenger {
  type: string;
  quantity: number;
}

export interface FlightOptions {
  allowMixedAirlines?: boolean;
  directFlightsOnly: boolean;
  nonStopFlightsOnly?: boolean;
  maxStops?: any;
}

export interface SearchInitRequest {
  agencyId: string;
  branchId: string;
  corporateId: string;
  travelType: string;
  tripType: string;
  segments: Segment2[];
  passengers: Passenger[];
  flightOptions: FlightOptions;
  airlinePreference?: any;
  currency: string;
  fareRestriction?: any;
  checkIn?: string;
  content?: any;
  locationName?: string;
}

export interface ConsumerConfirmation {
  frequentFlyerNumber?: string;
  ticketNumber?: any;
  invoiceNumber? : any;
  xlInvoiceNumber?: any;
  isCancelled: boolean;
  flightAddOnIds: any[];
  flightOptionId: string;
  approvalCode?: any;
  consumerId: string;
  segmentId?: number;
  id?: string;
  ticketIssueDate?: string;
}

export interface Product {
  flightOptions: FlightOption[];
  legs: Leg[];
  baggages: Baggage[];
  addOns: AddOn[];
  searchInitRequest: SearchInitRequest;
  origin: Airport;
  destination: Airport;
  id: string;
  type: string;
  approvalCode: string;
  totalAmount: any;
  consumerIds: string[];
  searchToken: string;
  consumerConfirmations: ConsumerConfirmation[];
  travelDate: Date;
  bookings: BookingInfo[]
  bookingStatus: string;
  hotelId?: string;
  hotelOptions?: HotelOption[];
}

export interface Cart {
  id: string;
  bookingId?: any;
  bookingStatus: string;
  bookingDate?: any;
  dateOfJourney: Date;
  agencyId: string;
  agencyName: string;
  facilitatorId: string;
  corporateId: string;
  corporateName: string;
  branchId: string;
  branchName: string;
  employeeId: string;
  employee: Employee;
  isPersonal: boolean;
  isDomestic: boolean;
  products: Product[];
  consumers: Consumer[];
  isSentForReview: boolean;
  approvers: string[];
  approvalStatus: string;
  approvedBy: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface CartApproval {
  cart: Cart;
  carts: Cart[];
}
