export interface Employee {
    title: string,
    firstName: string,
    lastName: string,
    emailId: string,
    dateOfBirth: string,
    employmentType: string,
    mobileNo: number,
    address: Address,
    profileInfo: ProfileInfo


}

export interface Address {
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    country: string,
    state: string,
    city: string,
    zip: string,
    emailId: string,
    alternateEmailId: string,
    mobileNo: number,
    phoneNo1: number,
    phoneNo2: number,
    faxNo: number
}

export interface ProfileInfo {
    id: string
}