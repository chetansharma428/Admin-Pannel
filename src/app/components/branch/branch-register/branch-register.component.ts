import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { NbDialogService } from '@nebular/theme';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';
@Component({
  selector: 'ngx-branch-register',
  templateUrl: './branch-register.component.html',
  styleUrls: ['./branch-register.component.scss']
})
export class BranchRegisterComponent implements OnInit {
  branchRegistration: FormGroup;
  public checked: boolean = false;
  loading: boolean = false;
  constructor(private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly storageService: StorageService,
    private branchService: BranchService,
    private readonly dialog: NbDialogService) { }

  ngOnInit(): void {
    this.createBranchForm();
  }

  createBranchForm() {
    this.branchRegistration = this.fb.group({
      "type": ['Branch'],
      "id": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
      "locationCode": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      "name": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      "panNo": [null, [Validators.pattern('^[A-Za-z]{5}[0-9]{4}[A-Za-z]$')]],
      "tanNo": [null],
      "creatorEmailId": [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      "emailId": [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      "parentId": [this.storageService.getItems('loggedinUserdetails')?.userDetails.ParentId],
      "associatedOrgId": [this.storageService.getItems('loggedinUserdetails')?.userDetails.ParentId],

      "registeredAddress": this.fb.group({
        "addressLine1": [null, [Validators.required]],
        "addressLine2": [],
        "addressLine3": [],
        "city": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "country": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "faxNo": [null],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [null, [Validators.pattern('^[0-9]{10}$')]],
        "phoneNo2": [null, [Validators.pattern('^[0-9]{10}$')]],
        "state": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      }),

      "communicationAddress": this.fb.group({
        "addressLine1": [null, [Validators.required]],
        "addressLine2": [null],
        'addressLine3': [null],
        "city": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "country": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "faxNo": [null],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [null, [Validators.pattern('^[0-9]{10}$')]],
        "phoneNo2": [null, [Validators.pattern('^[0-9]{10}$')]],
        "state": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      }),

      "pointOfContact": this.fb.group({
        "emailId": [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      }),

      "gsTs": this.fb.array([]),

    });

    const gsTs = this.branchRegistration.get('gsTs') as FormArray;
    gsTs.push(this.fb.group({
      "gstNo": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]{15}$')]],
      "gstRegisteredName": [null, [Validators.required]],
      "emailId": [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      "address": this.fb.group({
        "addressLine1": [null, [Validators.required]],
        "addressLine2": [null],
        "addressLine3": [null],
        "country": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [null, [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        "mobileNo": [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        "phoneNo1": [null, [Validators.pattern('^[0-9]{10}$')]],
        "phoneNo2": [null, [Validators.pattern('^[0-9]{10}$')]],
        "faxNo": [null],
      })
    }));
  }

  back() {
    const parentParams = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParams.id}/branch`]);
  }

  onCheck(checked: boolean) {
    this.checked = checked;
    const address = this.branchRegistration.value.registeredAddress;
    if (this.checked) {
      this.branchRegistration.controls.communicationAddress.setValue({
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        addressLine3: address.addressLine3,
        country: address.country,
        state: address.state,
        city: address.city,
        zip: address.zip,
        mobileNo: address.mobileNo,
        phoneNo1: address.phoneNo1,
        phoneNo2: address.phoneNo2,
        faxNo: address.faxNo,
      });
    } else {
      this.branchRegistration.controls.communicationAddress.setValue({
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        mobileNo: '',
        phoneNo1: '',
        phoneNo2: '',
        faxNo: ''
      });
    }
  };

  addGst() {
    const control = this.branchRegistration.get('gsTs') as FormArray;
    control.push(this.fb.group({
      "gstNo": ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{15}$/)]],
      "gstRegisteredName": ['', [Validators.required]],
      "emailId": ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      "address": this.fb.group({
        "addressLine1": [null, [Validators.required]],
        "addressLine2": [null],
        "addressLine3": [null],
        "country": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        "mobileNo": [null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        "phoneNo1": [null, [Validators.pattern(/^[0-9]*$/)]],
        "phoneNo2": [null, [Validators.pattern(/^[0-9]*$/)]],
        "faxNo": [null]
      })
    }));
  }

  deleteGst(gstIndex: number) {
    const control = this.branchRegistration.get('gsTs') as FormArray;
    control.removeAt(gstIndex);
  };

  register() {
    this.loading = true;
    if(this.findInvalidControls().length > 0) {
      this.loading = false;
      return false;

    } else {
      // console.log(this.branchRegistration.value)
      const formValue = this.branchRegistration.value;
      const parentParams = this.activatedRoute.parent.snapshot.params;
      this.branchService.createBranch(formValue).subscribe(res => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Success',
            message: 'Branch created successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParams.id}/branch`]);
        })
      },
      (error) => {
        this.loading = false;
        this.showDialog('Error', 'Please contact the Administrator.');
      }
      )
    }

  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.branchRegistration.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

}
