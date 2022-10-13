import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserProfileService } from '../../../lib/services/agency-service/user-profile/user-profile.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-create-agency-user-profile',
  templateUrl: './create-agency-user-profile.component.html',
  styleUrls: ['./create-agency-user-profile.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAgencyUserProfileComponent implements OnInit {

  permissionValues = [];

  permissionName: boolean;

  addEmployee = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    description: new FormControl('', [ Validators.required ]),
  })

  @ViewChild('autoInput') input;

  option: Array<any> = [];
  filteredOptions: string[] = [];

  loading: boolean = false;
  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router,
    private readonly agencyUserProfileService: UserProfileService, private dialog: NbDialogService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.loading = true;
    this.agencyUserProfileService.fetchAgenciesPermissionList().subscribe((res: any) => {
     this.filteredOptions = this.option = res;
     this.ref.detectChanges();
    })
    this.permissionName = false;
    this.loading = false;
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.option.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): string[] {
    return this.filter(value);
  }

  onChange() {
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value);
  }

  onSelectionChange($event) {
    this.option = this.option.filter(t => t !== $event);
    this.permissionName = true;
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value = '');
    this.permissionValues.push($event);
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
    this.router.navigate([`agencies/${parentParam.id}/user-profile/list`]);
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
    let name = this.addEmployee.get("name").value;
    let description = this.addEmployee.get("description").value;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    if((this.addEmployee.invalid || this.addEmployee.pristine) || this.permissionValues.length === 0) {
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Warning',
          message: 'Please fill the form !'
        }
      })
    } else {
      this.agencyUserProfileService.createAgencyUserProfile(parentParam.id, name, description, this.permissionValues)
      .subscribe((res) => {
        this.addEmployee.reset();
        this.permissionValues = [];
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Success',
            message: 'Agency User Profile Created.'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`agencies/${parentParam.id}/user-profile`]);
        })
      },
      (error) => {
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Error',
            message: 'Please contact the Administrator.'
          }
        })
      })
    }

  }

  // showDialog(status, message) {
  //   const parentParam = this.activatedRoute.parent.snapshot.params;
  //   this.dialog.open(SuccessDialogComponent, {
  //     context: {
  //       title: status,
  //       message: message
  //     }
  //   }).onClose.subscribe((res) => {
  //     this.router.navigate([`agencies/${parentParam.id}/user-profile`]);
  //   })
  // }

}
