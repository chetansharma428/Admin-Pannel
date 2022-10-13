import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CorporateGroupService } from '../../../lib/services/corporate-service/groups/corporate-group.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditGroupComponent implements OnInit {

  policiesValues = [];
  policyIds = [];

  loading: boolean = false;

  permissionName: boolean;

  corporatePolicyForAdd: Array<any> = [];

  groupId: any;

  updateGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    policies: new FormControl('')
  })

  corporatePolicyList$: Observable<any>;
  corporateGroupDetails$: Observable<any>;
  parentId: any;
  @ViewChild('autoInput') input;

  filteredOptions: string[] = [];

  queryParams: any;
  loadingPageData: boolean = false;

  option: any;
  constructor(private readonly _corporateGroupService: CorporateGroupService,
    private fb: FormBuilder, private route: ActivatedRoute, private readonly router: Router, private readonly dialog: NbDialogService) { }

  ngOnInit() {
    this.loadingPageData = true;
    this.groupId = this.route.snapshot.paramMap.get('id');
    const parentParam = this.route.parent.snapshot.params;
    this.corporateGroupDetails$ = this._corporateGroupService.getGroupDetails(parentParam.id, parentParam.corpId, this.groupId).pipe(
      map(res => {return res}),
      tap((res) => {this.corporateGroupForm(res)})
    )
    this.route.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this._corporateGroupService.fetchPolicyDetails(parentParam.id, parentParam.corpId).subscribe((res: any) => {
      this.filteredOptions = this.option = res.items;
    })
    this.loadingPageData = false;
  }

  corporateGroupForm(data) {
    this.updateGroup = this.fb.group({
      id: [data.id],
      name: [data.name]
    })
    this.permissionName = true;
    this.policiesValues = data?.policies;
    this.parentId = data.parentId;
    if(this.queryParams) {
      this.updateGroup.disable();
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.option.filter(optionValue => optionValue?.name.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): string[] {
    return this.filter(value)
  }

  onChange() {
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value);
    this.option = this.option.filter((value) => !this.policiesValues.includes(value.id));
  }

  onSelectionChange($event) {
    this.option.forEach((element) => {
      if(element.id === $event) {
        this.policiesValues.push(element);
      }
    })
    this.permissionName = true;
    this.option = this.option.filter(t => t.id !== $event);
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value = '');
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    let policyValues = [];
    this.policiesValues.forEach((policy) => {
      if(policy.name === tagToRemove.text) {
        policyValues.push(policy);
      }
    })
    this.option.push(policyValues[0]);
    this.policiesValues = this.policiesValues.filter(t => t.name !== tagToRemove.text);
    if(this.policiesValues.length === 0 ) {
      this.permissionName = false
    }
  }

  back() {
    const parentParam = this.route.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/groups`]);
  }


  updateGroupFunction() {
    this.loading = true;
    const parentParam = this.route.parent.snapshot.params;
    let id = this.updateGroup.get('id').value;
    let name = this.updateGroup.get('name').value;
    this._corporateGroupService.updateGroupAPi(parentParam.id, parentParam.corpId, id, name, this.policiesValues, this.parentId, this.groupId).subscribe((res) => {
      this.loading = false;
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Group Message',
          message: 'Group details saved successfully !'
        }
      }).onClose.subscribe((res) => {
        this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/groups`]);
      })
    },
    (error) => {
      this.loading = false;
      this.showDialog('Group Message', 'Some error occurred, Please contact your administrator')
    }
    )
  }

  showDialog(status, message) {
    const parentParam = this.route.parent.snapshot.params;
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    })
  }

}
