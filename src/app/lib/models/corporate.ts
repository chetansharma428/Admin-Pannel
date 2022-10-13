export interface Corporate {
  type: string,
  agreementValidityFrom: string,
  agreementValidityTo: string,
  associatedOrgType: string,
  departments: [],
  designations: [],
  projects: [],
  isMissedSavingEnabled: true,
  missedSavingMaxOffsetMins: number,
  missedSavingMaxAlternatives: number,
  paymentOptionConfiguration: Verticals,
  missedSavingReasons: string[],
  id: string,
  name: string,
  emailId: string,
  creatorEmailId: string,
  approvers: [],
  parentId: string,
  associatedOrgId: string,
  panNo: string,
  tanNo: string,
  registeredAddress: Address,
  communicationAddress: Address,
  pointOfContact: PointofContact,
  verifiedDomains: string[],
  gsTs: GST[],
  accountLedgerCodes: LedgerCodes[],
  isActive: boolean
}


export interface Verticals {
  flight: string[],
  hotel: string[]
}

export interface Address {
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  country: string,
  state: string,
  city: string,
  zip: string,
  mobileNo: number,
  phoneNo1: number,
  phoneNo2: number,
  faxNo: number
}

export interface PointofContact {
  title: string,
  firstName: string,
  lastName: string,
  emailId: string,
  mobileNo: number,
  phoneNo1: number,
  phoneNo2: number,
  faxNo: number,
  domain: string
}

export interface GST {
  gstNo: string,
  gstRegisteredName: string,
  emailId: string,
  address: Address
}

export interface LedgerCodes {
  code: string,
  description: string,
  isActive: boolean
}