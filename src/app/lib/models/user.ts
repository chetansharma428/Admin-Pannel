export interface UserObject {
  token: string;
  userDetails: UserDetails;
  org?: any;
  agencyName?: string;
  corporatePointOfContactId?: string;
  agencyPointOfContactId?: string;
  branchPointOfContact?: string;
  branchPointOfContactId?: string;
  branchLocationCode?: string;
  branchName?: string;
}
export interface BranchIdNameMap {
	Id: string;
	Name: string;
}
export interface UserDetails {
	Type: number;
	Designation?: any;
	BranchIds: string[];
	BranchIdNameMap: BranchIdNameMap[];
	EmailId: string;
	SearchEmailId: string;
	Code?: any;
	SearchType: string;
	Title: string;
	FirstName: string;
	SearchFirstName: string;
	MiddleName?: any;
	LastName: string;
	SearchLastName: string;
	MobileNo: number;
	ParentId: string;
	Password?: any;
	isActive: boolean;
	isVerified: boolean;
	Address: Address;
	ProfileId: string;
	approverIds: any[];
	domain: string;
	AgencyId?: any;
	Department?: any;
	EmpGroupId?: string;
	ProjectID?: string;
	EmployeeId?: string;
}

export interface User {
	token: string;
	details: UserDetails;
	org?: any;
	agencyName?: string;
	corporatePointOfContactId?: string;
	agencyPointOfContactId?: string;
	branchPointOfContact?: string;
	branchPointOfContactId?: string;
	branchLocationCode?: string;
	branchName?: string;
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
