import { map, switchMap, tap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PolicyService } from '../../../../lib/services/corporate-service/policy/policy.service';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Component({
  selector: 'ngx-policy-smart-table',
  templateUrl: './policy-smart-table.component.html',
  styleUrls: ['./policy-smart-table.component.scss']
})
export class PolicySmartTableComponent implements OnInit, AfterViewInit, OnDestroy {
  loading: boolean = false;

  settings = {
    mode: 'external',
    actions: {
      add: false
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      productType: {
        title: 'Product Type',
        type: 'string'
      },
      approvalType: {
        title: 'Approval Type',
        type: 'string'
      },
      link: {
        title: 'More Info',
        type: 'custom',
        actions: false,
        renderComponent: ViewDetailsComponent
      }
    },
  };
  policiesDetails$: Observable<any>;
  private policesList$ = new Subject<null>();
  @Input() singleSelectGroupValue: Array<any> = [];

  constructor(private readonly policyService: PolicyService, private readonly dialog: NbDialogService,
    private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.policiesDetails$ = this.policesList$.pipe(
      tap(() => this.loading = true),
      switchMap(() => this.policyService.fetchPolicies(parentParam.id, parentParam.corpId)),
      map((res) => {
        return res;
      },
      (error) => {
        this.loading = false;
      }
      ),
      tap(() => this.loading = false)
      )
  }

  onDeleteConfirm(event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Warning',
        message: 'Are you sure, do you want to delete ?'
      }
    }).onClose.pipe(tap((res) => {
      if(res) {
        this.policyService.deletePolicy(parentParam.id, parentParam.corpId, event.data.id).subscribe((data) => {
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Delete Profile',
              message: 'Profile Deleted Successfully.'
            }
          }).onClose.subscribe((res) => this.policesList$.next());
        },
        (error) => {
          this.dialog.open(SuccessDialogComponent, {
            context: {
              title: 'Delete Profile',
              message: 'error occurred. Contact administrator.'
            }
          })
        })
      }
    })
    ).subscribe((res) => {
      this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/policy`]);
    });
  }

  showDialog(status, message) {

  }

  selectedRow($event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/policy/update_Policy/${this.singleSelectGroupValue}/${$event.data.id}`]);
  }

  ngAfterViewInit() {
    this.policesList$.next();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.policesList$.complete();
  }

}
