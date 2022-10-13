import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CorporateEmployeeService } from '../../../lib/services/corporate-service/employee-group/corporate-employee.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EditProfileComponent implements OnInit {

  permissionValues = [];

  permissionName: boolean;

  addEmployee: FormGroup;

  corporateEmployeeProfile$: Observable<any>;

  profileId: any;

  @ViewChild('autoInput') input;

  filteredOptions: string[] = [];

  queryParams: any;

  option: any;

  loadingPageData: boolean = false;

  loading: boolean = false

  constructor(private readonly corporateEmployeeService: CorporateEmployeeService, private readonly router: Router,
    private fb: FormBuilder,
    private _addProfileDailog: NbDialogService, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadingPageData = true;
    this.profileId = this.activatedRoute.snapshot.paramMap.get('id');
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.corporateEmployeeProfile$ = this.corporateEmployeeService.getCorporateEmployeeProfile(parentParam.id, parentParam.corpId,this.profileId).pipe(
      map(res => { return res }),
      tap((res) => this.corporateEmployeeProfileForm(res))
    );
    this.corporateEmployeeService.fetchCorporatePermissionList().subscribe((res: any) => {
      this.filteredOptions = this.option = res;
    })
    this.activatedRoute.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this.loadingPageData = false;
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee-profile`]);
  }

  corporateEmployeeProfileForm(data) {
    this.addEmployee = this.fb.group({
      name: [data.name],
      description: [data.description],
    })
    this.permissionName = true;
    this.permissionValues = data.permissionsList;
    if(this.queryParams) {
      this.addEmployee.disable();
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.option.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): string[] {
    return this.filter(value)
  }

  onChange() {
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value);
    this.option = this.option.filter((value) => !this.permissionValues.includes(value));
  }

  onSelectionChange($event) {
    this.permissionValues.push($event);
    this.permissionName = true;
    this.option = this.option.filter(t => t !== $event);
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value = '');
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.option.push(tagToRemove.text);
    this.option.sort((first, secound) => first > secound ? 1 : -1);
    this.permissionValues = this.permissionValues.filter(t => t !== tagToRemove.text);
    if(this.permissionValues.length === 0) {
      this.permissionName = false;
    }
  }

  keyPressAlphaNumericWithCharacters(event) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z0-9-_@ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  updateEmployeeProfile() {
    this.loading = true;
    let name = this.addEmployee.get("name").value;
    let description = this.addEmployee.get("description").value;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.corporateEmployeeService.updateProfileInCorporate(parentParam.id,parentParam.corpId,name, description, this.permissionValues, this.profileId).subscribe((res) => {
      this.addEmployee.reset();
      this.loading = false;
      this.permissionValues = [];
      this._addProfileDailog.open(SuccessDialogComponent, {
        context: {
          title: 'Update Profile',
          message: 'Profile saved successfully.'
        }
      }).onClose.subscribe((res) => {
        this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee-profile`]);
      })
    },
    (error) => {
      this.loading = false;
      this._addProfileDailog.open(SuccessDialogComponent, {
        context: {
          title: 'Update Profile',
          message: 'Some error occurred, Please contact your administrator.'
        }
      })
    }
    )
  }

}
