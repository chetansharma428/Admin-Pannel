import { AgencyStaffComponent } from './../agency-staff/agency-staff.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../../../lib/services/agency-service/staff/staff.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { UserProfileService } from '../../../lib/services/agency-service/user-profile/user-profile.service';
import { NbDialogService } from '@nebular/theme';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-update-agency-staff',
  templateUrl: './update-agency-staff.component.html',
  styleUrls: ['./update-agency-staff.component.scss']
})
export class UpdateAgencyStaffComponent implements OnInit {

  agencyUserProfile$: Observable<any>;
  agencyUserRegistration: FormGroup;
  titleName = ['Mr.','Ms.'];
  userDetails;
  branchIdDetails: any;
  userProfile: any
  permissionValues: any;
  staffList: any;
  queryParams: any;
  branches: any;
  profile:any;
  approvers: any;
  domain: any;
  emailId: any;
  loadingFordata: boolean = false;
  loading: boolean = false;
  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly agencyStaffService: StaffService, private fb: FormBuilder, private readonly dialog: NbDialogService,
    private readonly strorageService: StorageService, private readonly agencyUserProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.loadingFordata = true;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    const paramMaps = this.activatedRoute.snapshot.params;
    this.userDetails = this.strorageService.getItems('userInfo');
    this.branchIdDetails = this.userDetails.branchIdNameMap;
    this.activatedRoute.queryParams.subscribe(params => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this.agencyUserProfileService.fetchAgenciesProfile(parentParam.id).subscribe((res: any) => {
      this.userProfile = res.items;
    })
    this.agencyStaffService.fetchAgencyStaff(parentParam.id).subscribe((res1: any) => {
      this.staffList = res1.items;
    })
    this.agencyUserProfile$ = this.agencyStaffService.fetchParticularAgencyStaff(parentParam.id, paramMaps.emailId).pipe(
      map(res => {return res}),
      tap((res) => this.agencyUserProfile(res))
    )
    this.loadingFordata = false;
  }

  agencyUserProfile(data) {
    this.agencyUserRegistration = this.fb.group({
      Title: [data.title],
      FirstName: [data.firstName, [Validators.required]],
      LastName: [data.lastName, [Validators.required]],
      EmailId: [data.emailId, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      MobileNo: [data.mobileNo, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      domain: [data.domain, Validators.pattern('^[0-9a-zA-Z.,/: ]*$')],
      approverIds: [data.approverIds],
      branchIds: [data.branchIds],
      id:[data.parentId],
      isVerified: [data.isVerified],
      isActive: [data.isActive],
      Address: this.fb.group({
        AddressLine1: [data.address.addressLine1, [Validators.required]],
        City: [data.address.city, [Validators.required]],
        Country: [data.address.country, [Validators.required]],
        faxNo: [data.address.faxNo],
        mobileNo: [data.address.mobileNo, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        phoneNo1: [data.address.phoneNo1, [Validators.pattern(/^[0-9]*$/)]],
        phoneNo2: [data.address.phoneNo2,[Validators.pattern(/^[0-9]*$/)]],
        State: [data.address.state, [Validators.required]],
        Zip: [data.address.zip, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
      }),
      ProfileInfo: this.fb.group({
        Id: [data.profileInfo.id],
      }),
    })
    this.branches = data.branchIds;
    this.approvers = data.approverIds;
    this.profile = data.profileInfo.name;
    this.domain = data.domain;
    this.emailId = data.emailId;

    this.agencyUserRegistration.get('isActive').disable();
    this.agencyUserRegistration.get('isVerified').disable();
    if(this.queryParams) {
      this.agencyUserRegistration.disable();
    }

  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.agencyUserRegistration.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`agency/${parentParam.id}/staff/list`])
  }

  resendInviteLink() {
    this.loading = true;
    this.agencyStaffService.resendInviteApi(this.emailId, this.domain).subscribe((res) => {
      this.loading = false;
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Success',
          message: 'Verification link sended successfully'
        }
      })
    },
    (error) => {
      this.loading = false;
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Error',
          message: 'Some error occurred, Please contact your administrator.'
        }
      })
      }
    )
  }

  updateAgencyProfile() {
    this.loading = true;
    if(this.findInvalidControls.length > 0) {
      this.loading = false;
      return false;
    } else {
      this.agencyStaffService.updateAgencyStaff(this.agencyUserRegistration.value).subscribe((data: any) => {
        this.loading = false;
        this.showDialog('Success', 'Profile updated successfully.')
      },
      (error) => {
        this.loading = false;
        this.showDialog('Error', 'Some error occurred, Please contact your administrator.');
      }
      )
    }
  }

  showDialog(status, message) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    }).onClose.subscribe((res) => {
      this.router.navigate([`agency/${parentParam.id}/staff/list`])
    })
  }

}
