import { PolicyTypeComponent } from './policy-type/policy-type.component';
import { ViewpolicyComponent } from './viewpolicy/viewpolicy.component';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { PolicyNameComponent } from './policy-name/policy-name.component';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';
import { CorporateGroupService } from '../../../../lib/services/corporate-service/groups/corporate-group.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnInit, AfterViewInit, OnDestroy {


  settings: any;
  pageSize: number = 10000;

  corporateGroupList$: Observable<any>;
  private updatedCorporateGroupList$ = new Subject<null>();
  corporateId: any;

  userInfo: any;
  source: LocalDataSource;
  ownDetails: Array<any> = [];

  loading: boolean = false;
  errorMessage: any;
  constructor(private readonly corporateGroupsService: CorporateGroupService,
    private readonly router: Router,
    private readonly dialog: NbDialogService,
    private route: ActivatedRoute,
    private readonly storageService: StorageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef) {

  }
  ngOnInit() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.userInfo = this.storageService.getItems('userInfo');
    let loggedInUser = this.storageService.getItems('loggedinUserdetails');
    let profileDetails = this.storageService.getItems('profileDetail');
    let permissionAccessOrNot = profileDetails[0]?.permissionsList.filter((list) => list === 'corporate-read-only');
    if(this.userInfo?.userType.toLowerCase() === 'agencyadmin' || this.userInfo?.userType.toLowerCase() === 'corporateadmin') {
      this.corporateGroupList$ = this.updatedCorporateGroupList$.pipe(
        tap(() => this.loading = true),
        switchMap(() => this.corporateGroupsService.fetchCorporateGroups(parentParam.id, parentParam.corpId, this.pageSize)),
        map((res) => {
          return res;
        },
        (error) => {
          this.loading = false;
        }
        ),
        tap(() => this.loading = false)
        );
        this.settings = {
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
          // noDataMessage: this.errorMessage,
          columns: {
            name: {
              title: 'Group Name',
              type: 'string',
            },
            policyName: {
              title: 'Polices Attached',
              type:'custom',
              action: false,
              renderComponent: PolicyNameComponent
            },
            custom: {
              title: 'Polices Type',
              type:'custom',
              action: false,
              renderComponent: PolicyTypeComponent
            },
            link: {
              title: 'more Info',
              type: 'custom',
              actions: false,
              renderComponent: ViewpolicyComponent
            }
          },
        };
    } else {
      this.loading = true;
      if(this.userInfo?.userType.toLowerCase() === 'corporateemployee' && permissionAccessOrNot != null) {
        this.corporateGroupsService.getGroupDetails(parentParam.id, parentParam.corpId, loggedInUser.userDetails.EmpGroupId)
        .subscribe((res) => {
          this.ownDetails.push(res);
          this.source = new LocalDataSource(this.ownDetails);
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
        )
        this.settings = {
          mode: 'external',
          actions: {
            add: false,
            edit: false,
            delete: false
          },
          columns: {
            name: {
              title: 'Group Name',
              type: 'string',
            },
            policyName: {
              title: 'Polices Attached',
              type:'custom',
              action: false,
              renderComponent: PolicyNameComponent
            },
            custom: {
              title: 'Polices Type',
              type:'custom',
              action: false,
              renderComponent: PolicyTypeComponent
            },
            link: {
              title: 'View Policies',
              type: 'custom',
              actions: false,
              renderComponent: ViewpolicyComponent
            }
          },
        };
      } else {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Employee Group Access',
            message: 'You do not have the permission to access this group.'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate(['/dashboard']);
        })
      }
    }
  }

  onDeleteConfirm(event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Warning',
        message: 'Are you sure, do you want to delete ?'
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          this.corporateGroupsService.deleteGroup(parentParam.id, parentParam.corpId, event.data.id).subscribe((res) => {
            this.showDialog('Success', 'Group has been deleted successfully.');
          },
          (error) => {
            this.showDialog('Error', 'Some error occurred, Please contact your administrator.');
          })
        }

      })
    ).subscribe((res) => this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/groups`]));
  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    }).onClose.subscribe((res) => this.updatedCorporateGroupList$.next());
  }

  selectedRow($event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/groups/${$event.data.id}`]);
  }

  ngAfterViewInit() {
    this.updatedCorporateGroupList$.next();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.updatedCorporateGroupList$.complete();
  }
}
