import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CorporateEmployeeService } from '../../../lib/services/corporate-service/employee-group/corporate-employee.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';


@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent implements OnInit {

  permissionValues = [];

  permissionName: boolean;

  addEmployee = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    description: new FormControl('', [Validators.required]),
  })

  @ViewChild('autoInput') input;

  filteredOptions: string[] = [];

  option: any;
  loading: boolean = false;
  constructor(private readonly corporateEmployeeService: CorporateEmployeeService, private readonly router: Router,
    private _addProfileDailog: NbDialogService, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.corporateEmployeeService.fetchCorporatePermissionList().subscribe((res: any) => {
      this.filteredOptions = this.option = res;
    })

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
  }

  onSelectionChange($event) {
    this.permissionValues.push($event);
    this.permissionName = true;
    this.option = this.option.filter(t => t !== $event);
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value = '');
    ;
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.option.push(tagToRemove.text);
    this.option.sort((first, secound) => first > secound ? 1 : -1);
    this.permissionValues = this.permissionValues.filter(t => t !== tagToRemove.text);
    if(this.permissionValues.length === 0) {
      this.permissionName = false;
    }
  }
  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee-profile`]);
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

  addEmployeeProfile() {
    this.loading = true;
    let name = this.addEmployee.get("name").value;
    let description = this.addEmployee.get("description").value;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    if((this.addEmployee.invalid || this.addEmployee.pristine) || this.permissionValues.length === 0 ) {
      this.loading = false;
      this._addProfileDailog.open(SuccessDialogComponent, {
        context: {
          title: 'Warning',
          message: 'Please fill the form !'
        }
      })
    } else {
      this.corporateEmployeeService.addProfileInCorporate(parentParam.id, parentParam.corpId, name, description, this.permissionValues).subscribe((res) => {
        this.addEmployee.reset();
        this.permissionValues = [];
        this.loading = false;
        this._addProfileDailog.open(SuccessDialogComponent, {
          context: {
            title: 'Add Profile',
            message: 'Profile created successfully !'
          }
        }).onClose.subscribe((res) => {

          this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee-profile`]);
        })
      },
        (error) => {
          this.loading = false;
          this.addEmployee.reset();
          this.permissionValues = [];
          this._addProfileDailog.open(SuccessDialogComponent, {
            context: {
              title: 'Add Profile',
              message: 'Some error occurred, Please contact your administrator.'
            }
          })
        }
      )
    }

  }

}
