import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { EmployeeService } from '../../../lib/services/employee-service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'ngx-employee-profile',
  templateUrl: './employee-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  @ViewChild('autoInput') input;
  title: string;
  employeeData: any;
  employeeProfile: FormGroup;

  options: any = [];
  filteredOptions$: Observable<string[]>;
  empGroupData: any;

  employeeProfile$: Observable<any>;

  queryParams: any;
  loadingPageData: boolean = false;
  loading: boolean = false;
  constructor(private readonly employeeService: EmployeeService, private readonly activatedRoute: ActivatedRoute, private readonly fb: FormBuilder, private readonly dialog: NbDialogService, private readonly router: Router) { }

  ngOnInit(): void {
    this.loadingPageData = true;
    const parentParams = this.activatedRoute.parent.snapshot.params;
    const childParams = this.activatedRoute.snapshot.params;

    this.employeeProfile$ = this.employeeService.fetchEmployeedata(parentParams, childParams).pipe(
      map(res => res),
      tap((res) => {
        this.employeeData = res;
        this.employeeForm(res)
        this.setAddressValidators();
      }));

    this.activatedRoute.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this.filteredOptions$ = of(this.options);
    this.empGroupData = this.employeeService.fetchEmpGroup(parentParams).subscribe(res => {
      this.empGroupData = res;
      this.empGroupData.items.forEach(element => {
        this.options.push(element.name);
      });
    })
    this.loadingPageData = false;
  }

  employeeForm(data) {
    // console.log(data);
    this.employeeProfile = this.fb.group({
      "agencyId": [data.agencyId],
      "parentId": [data.parentId],
      "employeeId": [data.employeeId],
      "title": [data.title, [Validators.required]],
      "firstName": [data.firstName, [Validators.required]],
      "lastName": [data.lastName, [Validators.required]],
      "dateOfBirth": [data.dateOfBirth],
      "emailId": [data.emailId, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      "mobileNo": [data.mobileNo, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      "department": [data.department, [Validators.required]],
      "designation": [data.designation, [Validators.required]],
      "employmentType": [data.employmentType],
      "frequentFlyer": [data.frequentFlyer],
      "domain": [data.domain, [Validators.required]],
      "approverIds": [data.approverIds],
      "isActive": [data.isActive],
      "isVerified": [data.isVerified],

      "address": this.fb.group({
        "addressLine1": [data.address?.addressLine1],
        "addressLine2": [data.address?.addressLine2],
        "addressLine3": [data.address?.addressLine3],
        "city": [data?.address?.city],
        "country": [data?.address?.country],
        "state": [data?.address?.state],
        "zip": [data?.address?.zip],
        "mobileNo": [data?.address?.mobileNo, [Validators.pattern(/^[0-9]{10}$/)]],
        "phoneNo1": [data?.address?.phoneNo1, [Validators.pattern(/^[0-9]{10}$/)]],
        "phoneNo2": [data?.address?.phoneNo2, [Validators.pattern(/^[0-9]{10}$/)]],
        "faxNo": [data.address?.faxNo],
      }),

      "empGroup": this.fb.group({
        "id": [data.empGroup.id]
      }),

      "profileInfo": this.fb.group({
        "id": [data.profileInfo.id]
      })
    });

    if(this.queryParams) {
      this.employeeProfile.disable();
    }
    console.log(this.queryParams);
  }

  setAddressValidators() {
    const cityControl = this.employeeProfile.get('address.city');
    const countryControl = this.employeeProfile.get('address.country');
    const stateControl = this.employeeProfile.get('address.state');
    const zipControl = this.employeeProfile.get('address.zip');

    if (this.employeeProfile.get('address?.addressLine1')?.value.length != 0) {
      cityControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
      countryControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
      stateControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
      zipControl.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
    }

    this.employeeProfile.get('address?.addressLine1')?.valueChanges
      .subscribe(addressLine1 => {
        // console.log(addressLine1)
        if (addressLine1?.length != 0) {
          cityControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
          countryControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
          stateControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
          zipControl.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
        }
        else {
          cityControl.setValidators(null);
          countryControl.setValidators(null);
          stateControl.setValidators(null);
          zipControl.setValidators(null);
        }
        cityControl.updateValueAndValidity();
        countryControl.updateValueAndValidity();
        stateControl.updateValueAndValidity();
        zipControl.updateValueAndValidity();
      });


  }

  back() {
    this.router.navigate([`${this.employeeProfile.value.agencyId}/corporate/${this.employeeProfile.value.parentId}/employee/list`]);
  }



  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    });
  };

  updateEmployee() {
    this.loading = true;
    const paramMaps = this.activatedRoute.parent.snapshot.params;

    this.employeeProfile.value.frequentFlyer = [{ 'airlineCode': 'ABC', 'ffNumber': '1234567' }];
    this.employeeService.updateEmployee(paramMaps, this.employeeProfile.value).subscribe((res) => {
      this.loading = false;
      this.showDialog('Success', 'Employee details saved successfully.')
      this.router.navigate([`${this.employeeProfile.value.agencyId}/corporate/${this.employeeProfile.value.parentId}/employee/list`]);
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  // autoSuggest functions of 'empGroup'
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString)),
    );
  }

  onChange() {
    this.filteredOptions$ = this.getFilteredOptions(this.input.nativeElement.value);
  }

  onSelectionChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event);
  }

}

