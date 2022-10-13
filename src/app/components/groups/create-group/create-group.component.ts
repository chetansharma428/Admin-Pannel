import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CorporateGroupService } from '../../../lib/services/corporate-service/groups/corporate-group.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGroupComponent implements OnInit {

  policiesValues = [];

  permissionName: boolean;

  addGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', {
      validators: [Validators.required],
    }),
  })
  loading: boolean = false;
  @ViewChild('autoInput') input;

  filteredOptions: string[] = [];

  option: any;

  constructor(private readonly _corporateGroupService: CorporateGroupService,
    private route: ActivatedRoute, private readonly router: Router, private readonly dialog: NbDialogService,) { }

  ngOnInit() {
    const parentParam = this.route.parent.snapshot.params;
    this._corporateGroupService.fetchPolicyDetails(parentParam.id, parentParam.corpId).subscribe((res: any) => {
      this.filteredOptions = this.option = res.items
    })
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

  keyPressAlphaNumericWithCharacters(event) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z0-9-_]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  back() {
    const parentParam = this.route.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/groups`]);
  }

  createNewGroup() {
    this.loading = true;
    const parentParam = this.route.parent.snapshot.params;
    let id = this.addGroup.get('id').value;
    let name = this.addGroup.get('name').value;
    if((this.addGroup.invalid || this.addGroup.pristine) || this.policiesValues.length === 0) {
      this.loading = false;
      this.dialog.open(SuccessDialogComponent, {
        context: {
          title: 'Warning',
          message: 'Please fill the form !'
        }
      })
    } else {
      this._corporateGroupService.createGroupAPi(parentParam.id, parentParam.corpId, id, name, this.policiesValues).subscribe((res) => {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Group Message',
            message: 'Group create successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/groups`]);
        })
      },
      (error) => {
        this.loading = false;
        this.showDialog('Group Message', 'Some error occurred, Please contact your administrator.');
        }
      )
    }
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
