import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { StaffService } from '../../../lib/services/agency-service/staff/staff.service';
import { UserProfileService } from '../../../lib/services/agency-service/user-profile/user-profile.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-create-agency-staff',
  templateUrl: './create-agency-staff.component.html',
  styleUrls: ['./create-agency-staff.component.scss']
})
export class CreateAgencyStaffComponent implements OnInit {
  agencyUserRegistration: FormGroup;
  titleName = ['Mr.', 'Ms.'];
  staffList: any;
  branches: any;
  userProfile: any;
  loading: boolean = false;

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private readonly agencyStaffService: StaffService,
    private readonly storageService: StorageService,
    private readonly agencyUserProfileService: UserProfileService, private dialog: NbDialogService,) { }

  ngOnInit(): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.agencyStaffService.fetchAgencyStaff(parentParam.id).subscribe((res1: any) => {
      this.staffList = res1.items;
    })
    this.branches = this.storageService.getItems('agencyBranchesDetails')?.items;

    this.agencyUserProfileService.fetchAgenciesProfile(parentParam.id).subscribe((res: any) => {
      this.userProfile = res.items;
    })
    this.agencyUserForm();
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`agency/${parentParam.id}/staff/list`]);
  }

  agencyUserForm() {
    this.agencyUserRegistration = this.fb.group({
      Title: [null, [Validators.required]],
      FirstName: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      LastName: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      EmailId: [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      MobileNo: [null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      domain: [null, [Validators.required, Validators.pattern('^(?!.* .*)(?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$')]],
      approverIds: [null],
      branchIds: [null],
      isVerified: [false],
      isActive: [false],
      parentId:[null],
      agencyId:[null],
      Address: this.fb.group({
        AddressLine1: [null, [Validators.required]],
        City: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        Country: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        faxNo: [null],
        mobileNo: [null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        phoneNo1: [null, [Validators.pattern(/^[0-9]*$/)]],
        phoneNo2: [null, [Validators.pattern(/^[0-9]*$/)]],
        State: [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        Zip: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
      }),
      ProfileInfo: this.fb.group({
        Id: [null],
      }),
    })
  }


  createAgencyProfile() {
    this.loading = true;
    if(this.findInvalidControls().length > 0) {
      this.loading = false;
      return false;
    } else {
      const parentParam = this.activatedRoute.parent.snapshot.params;
      const formValue = this.agencyUserRegistration.value;
      formValue.parentId = parentParam.id;
      formValue.agencyId = parentParam.id;
      this.agencyStaffService.createAgencyStaff(formValue).subscribe((res) => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Success',
            message: 'Agency user created successfully.'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`agency/${parentParam.id}/staff/list`]);
        })
      },
      (error) => {
        this.loading = false
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Error',
            message: 'Please contact the Administrator.'
          }
        })
      }
      );
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

    console.log(invalid);
    return invalid;
  }

}
