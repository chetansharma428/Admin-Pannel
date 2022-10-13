import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../lib/services/employee-service/employee.service';
import { NbDialogService } from '@nebular/theme';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.scss']
})
export class EmployeeRegisterComponent implements OnInit {
  @ViewChild('empInput') empInput;
  @ViewChild('profileInput') profileInput;

  options: any = [];
  filteredOptions$: Observable<string[]>;
  empGroupData: any;
  profileGroupData: any;
  employee: FormGroup;

  employeeOptions$: Observable<any[]>;
  profileOptions$: Observable<any[]>;

  employeeOptions: [] = [];
  profileOptions: [] = [];

  loading: boolean = false;
  constructor(private readonly fb: FormBuilder, private readonly activatedRoute: ActivatedRoute, private readonly employeeService: EmployeeService, private readonly dialog: NbDialogService, readonly router: Router) { }

  ngOnInit(): void {

    const params = this.activatedRoute.parent.snapshot.params;

    forkJoin([this.employeeService.fetchEmpGroup(params), this.employeeService.fetchProfileGroup(params)]).subscribe(res => {
      this.employeeOptions$ = of(res[0]['items']);
      this.employeeOptions = res[0]['items'];

      this.profileOptions$ = of(res[1]['items']);
      this.profileOptions = res[1]['items'];
    });

    this.employeeRegistration(params);
    this.setAddressValidators();
  }

  employeeRegistration(params) {
    this.employee = this.fb.group({
      "agencyId": [params.id],
      "parentId": [params.corpId],
      "employeeId": [this.employeeService.generateGuid()],
      "title": [null, [Validators.required]],
      "firstName": [null, [Validators.required]],
      "lastName": [null, [Validators.required]],
      "dateOfBirth": [],
      "emailId": [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')]],
      "mobileNo": [null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      "department": [null, [Validators.required]],
      "designation": [null, [Validators.required]],
      "employmentType": [],
      "frequentFlyer": [],
      "domain": [null, [Validators.required]],
      "approverIds": [],

      "address": this.fb.group({
        "addressLine1": [null],
        "addressLine2": [''],
        "addressLine3": [''],
        "city": [null],
        "country": [null],
        "state": [null],
        "zip": [null],
        "mobileNo": [null, [Validators.pattern(/^[0-9]{10}$/)]],
        "phoneNo1": [null, [Validators.pattern(/^[0-9]{10}$/)]],
        "phoneNo2": [null, [Validators.pattern(/^[0-9]{10}$/)]],
        "faxNo": [],
      }),
      "empGroup": this.fb.group({
        "id": [null]
      }),

      "profileInfo": this.fb.group({
        "id": [null]
      }),
    });
  }

  setAddressValidators() {
    const cityControl = this.employee.get('address.city');
    const countryControl = this.employee.get('address.country');
    const stateControl = this.employee.get('address.state');
    const zipControl = this.employee.get('address.zip');

    this.employee.get('address.addressLine1').valueChanges
      .subscribe(addressLine1 => {
        if (addressLine1.length != 0) {
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
    this.router.navigate([`${this.employee.value.agencyId}/corporate/${this.employee.value.parentId}/employee/list`]);
  }

  register() {
    this.loading = true;
    let empId: any = this.employeeOptions.filter((res: any) => res.name === this.employee.value.empGroup.id);
    this.employee.value.empGroup.id = empId[0]?.id;

    let profilId: any = this.profileOptions.filter((res: any) => res.name === this.employee.value.profileInfo.id);
    this.employee.value.profileInfo.id = profilId[0]?.id;

    console.log(this.employee.value)
    const paramMaps = this.activatedRoute.parent.snapshot.params;
    this.employeeService.registerEmployee(paramMaps, this.employee.value).subscribe(res => {
      this.loading = false;
      this.showDialog('Success', 'Corporate has been Created.');
      this.router.navigate([`${this.employee.value.agencyId}/corporate/${this.employee.value.parentId}/employee/list`]);
    }, error => {
      this.loading = false;
      this.showDialog('Error', 'Please contact the Administrator.');
    });
  }

  onChange(observer: string, input: string, option: string) {
    this[observer] = this.getFilteredOptions(this[input].nativeElement.value, option);
  }

  getFilteredOptions(value: string, option: string): Observable<any[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString, option)),
    );
  }

  //functions for autoselect option
  private filter(value: string, option: string): any[] {
    const filterValue = value.toLowerCase();
    return this[option].filter(optionValue => optionValue.name.toLowerCase().includes(filterValue));
  }

  onSelectionChange($event, observer, option) {

    if (option === 'profileOptions') {
      let profilId: any = this.profileOptions.filter((res: any) => res.name === this.employee.value.profileInfo.id);
      this.employee.value.profileInfo.id = profilId[0]?.id;
    } else {
      let empId: any = this.employeeOptions.filter((res: any) => res.name === this.employee.value.empGroup.id);
      this.employee.value.empGroup.id = empId[0]?.id;
    }

    this[observer] = this.getFilteredOptions($event, option);
  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    });
  }
}
