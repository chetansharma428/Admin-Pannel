import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';
import { NbDialogService } from '@nebular/theme';
@Component({
  selector: 'ngx-branch-profile',
  templateUrl: './branch-profile.component.html',
  styleUrls: ['./branch-profile.component.scss']
})
export class BranchProfileComponent implements OnInit {
  branchProfile$: Observable<any>;
  branchProfile: FormGroup;
  queryParams: any;
  view: boolean = false;
  loading: boolean = false;
  constructor(private fb: FormBuilder, private readonly activatedRoute: ActivatedRoute, private readonly branchService: BranchService, private readonly router: Router, private readonly dialog: NbDialogService) { }

  ngOnInit(): void {
    const paramMaps = this.activatedRoute.snapshot.params;
    const parentParam = this.activatedRoute.parent.snapshot.params;

    this.activatedRoute.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    });

    if (this.queryParams?.mode) {
      this.view = true;
    }

    this.branchProfile$ = this.branchService.fetchBranchdata(parentParam, paramMaps).pipe(
      map(res => { return res }),
      tap((res) => this.branchForm(res)));
  }

  branchForm(data) {
    this.branchProfile = this.fb.group({
      "type": [data.type],
      "accountLedgerCodes": [data.accountLedgerCodes],
      "approvers": [data.approvers],
      "id": [data.id, [Validators.required]],
      "isActive": [data.isActive],
      "locationCode": [data.locationCode],
      "name": [data.name, [Validators.required]],
      "panNo": [data.panNo, [Validators.pattern(/^[a-zA-Z0-9]{10}$/)]],
      "tanNo": [data.tanNo],
      "creatorEmailId": [data.creatorEmailId, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      "emailId": [data.emailId, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      "parentId": [data.parentId],
      "associatedOrgId": [data.associatedOrgId],

      "registeredAddress": this.fb.group({
        "addressLine1": [data.registeredAddress.addressLine1, [Validators.required]],
        "addressLine2": [data.registeredAddress.addressLine2],
        "addressLine3": [data.registeredAddress.addressLine3],
        "country": [data.registeredAddress.country, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [data.registeredAddress.state, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [data.registeredAddress.city, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [data.registeredAddress.zip, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        "mobileNo": [data.registeredAddress.mobileNo, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        "phoneNo1": [data.registeredAddress.phoneNo1, [Validators.pattern(/^[0-9]*$/)]],
        "phoneNo2": [data.registeredAddress.phoneNo2, [Validators.pattern(/^[0-9]*$/)]],
        "faxNo": [data.registeredAddress.faxNo],
      }),

      "communicationAddress": this.fb.group({
        "addressLine1": [data.registeredAddress.addressLine1, [Validators.required]],
        "addressLine2": [data.registeredAddress.addressLine2],
        "addressLine3": [data.registeredAddress.addressLine3],
        "country": [data.registeredAddress.country, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "state": [data.registeredAddress.state, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "city": [data.registeredAddress.city, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        "zip": [data.registeredAddress.zip, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        "mobileNo": [data.registeredAddress.mobileNo, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        "phoneNo1": [data.registeredAddress.phoneNo1, [Validators.pattern(/^[0-9]*$/)]],
        "phoneNo2": [data.registeredAddress.phoneNo2, [Validators.pattern(/^[0-9]*$/)]],
        "faxNo": [data.registeredAddress.faxNo],
      }),

      "pointOfContact": this.fb.group({
        "emailId": [data.pointOfContact.emailId, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        "mobileNo": [data.pointOfContact.mobileNo, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      }),

      "gsTs": this.fb.array([]),

    });

    const control = this.branchProfile.get('gsTs') as FormArray;
    data.gsTs.forEach(element => {
      control.push(this.fb.group({
        "gstNo": [element.gstNo, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{15}$/)]],
        "gstRegisteredName": [element.gstRegisteredName, [Validators.required]],
        "emailId": [element.emailId, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        "address": this.fb.group({
          "addressLine1": [element.address.addressLine1, [Validators.required]],
          "addressLine2": [element.address.addressLine2],
          "addressLine3": [element.address.addressLine3],
          "country": [element.address.country, [Validators.required]],
          "state": [element.address.state, [Validators.required]],
          "city": [element.address.city, [Validators.required]],
          "zip": [element.address.zip, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
          "mobileNo": [element.address.mobileNo, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
          "phoneNo1": [element.address.phoneNo1, [Validators.pattern(/^[0-9]*$/)]],
          "phoneNo2": [element.address.phoneNo2, [Validators.pattern(/^[0-9]*$/)]],
          "faxNo": [element.address.faxNo],
        })
      }));
    });

    if (this.queryParams?.mode) {
      this.branchProfile.disable();
    }
  }

  updateBranch() {
    this.loading = true;
    if (this.findInvalidControls().length > 0) {
      this.loading = false;
      return false;
    } else {
      const formValue = this.branchProfile.value;
      const parentParams = this.activatedRoute.parent.snapshot.params;
      this.branchService.updateBranch(formValue).subscribe(res => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Success',
            message: 'Branch has been Updated. !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParams.id}/branch`]);
        })
      }, error => {
        this.loading = false;
        this.showDialog('Error', 'Please contact the Administrator.');
      });
    }
  };

  back() {
    const parentParams = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParams.id}/branch`]);
  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    });
  }

  addGst() {
    const control = this.branchProfile.get('gsTs') as FormArray;
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
    const control = this.branchProfile.get('gsTs') as FormArray;
    control.removeAt(gstIndex)
  };

  public findInvalidControls() {
    const invalid = [];
    const controls = this.branchProfile.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    console.log(invalid);
    return invalid;
  }

}

