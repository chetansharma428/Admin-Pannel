export interface UserInfo {
  token: string,
  emailId: string,
  userType: string,
  title: string
  firstName: string,
  lastName: string,
  mobileNo: number,
  parentId: string,
  agencyId: string;
  agencyName: string;
  profileId: string,
  availPoint: number,
  branchIds: string[];
  branchIdNameMap: BranchIdNameMap[];
  selectedBranch: string;
  isPersonal: boolean;
  corporateId: string;
  designation: string;
  code: string;
  approverIds: string[];
  department: string;
  employeeGroupId: string;
  projectId: string;
  corporateName: string;
  agencyPointOfContactId: string;
  corporatePointOfContactId: string;
  address: Address;
  branchPointOfContact: string;
  branchPointOfContactId: string;
  branchLocationCode: string;
  branchName: string;
  isB2cUser?: boolean;
  isPortalRedirectedUser?: boolean
}


export interface Address {
  AddressLine1: string;
  AddressLine2?: any;
  AddressLine3?: any;
  Country: string;
  State: string;
  City: string;
  Zip: string;
  MobileNo: number;
  PhoneNo1: number;
  PhoneNo2: number;
  FaxNo: number;
}

export interface BranchIdNameMap {
  Id: string;
  Name: string;
}
