import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserProfileService } from '../../../lib/services/agency-service/user-profile/user-profile.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-update-agency-user-profile',
  templateUrl: './update-agency-user-profile.component.html',
  styleUrls: ['./update-agency-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAgencyUserProfileComponent implements OnInit {

  agencyUserProfile$: Observable<any>;

  profileId: any;
  addEmployee: FormGroup;
  permissionValues = [];
  permissionName: boolean;
  permissionValuesName: string;

  @ViewChild('autoInput') input;

  option: Array<any> = [];
  filteredOptions: string[] = [];


  queryParams:any;
  loadingPage: boolean = false;
  loading: boolean = false;
  constructor(private fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly agencyUserProfileService: UserProfileService,
    private readonly router: Router,private readonly dialog: NbDialogService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadingPage = true;
    this.profileId = this.activatedRoute.snapshot.paramMap.get('id');
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.activatedRoute.queryParams.subscribe(params => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this.agencyUserProfile$ = this.agencyUserProfileService.getAgencyProfile(parentParam.id, this.profileId).pipe(
      tap(() => this.loadingPage = true),
      map(res => { return res }),
      tap((res) => this.agencyUserProfile(res)),
      tap(() => this.loadingPage = false),
    )
    this.agencyUserProfileService.fetchAgenciesPermissionList()
    .subscribe((res: any) => {
      this.filteredOptions = this.option = res;
      this.ref.detectChanges();
    })
    this.loadingPage = false;
  }


  agencyUserProfile(data) {
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


  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`agencies/${parentParam.id}/user-profile/list`]);
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
    this.option = this.option.filter((value) => !this.permissionValues.includes(value));
  }

  onSelectionChange($event) {
    this.option = this.option.filter(t => t !== $event);
    this.permissionValues.push($event);
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
    this.agencyUserProfileService.updateAgencyUserProfile(parentParam.id,name, description, this.permissionValues, this.profileId).subscribe((res) => {
      this.addEmployee.reset();
      this.loading = false;
      this.permissionValues = [];
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Success',
          message: 'User profile updated successfully.'
        }
      }).onClose.subscribe((res) => {
        this.router.navigate([`agencies/${parentParam.id}/user-profile`])
      })
    },
    (error) => {
      this.loading = false;
      this.addEmployee.reset();
      this.permissionValues = [];
      this.showDialog('Error', 'Some error occurred, Please contact your administrator.');
    }
    )
  }

  showDialog(status, message) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    })
  }

}
