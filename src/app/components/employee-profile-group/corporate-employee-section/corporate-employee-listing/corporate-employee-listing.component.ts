import { UserInfo } from './../../../../lib/models/userInfo';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';
import { CorporateEmployeeService } from '../../../../lib/services/corporate-service/employee-group/corporate-employee.service';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { LocalDataSource } from 'ng2-smart-table';
import { ViewDetailComponent } from './view-detail/view-detail.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
// import { ViewDetailsComponent } from '../../../employee/employee-section/employee-listing/view-details/view-details.component';

@Component({
  selector: 'ngx-corporate-employee-listing',
  templateUrl: './corporate-employee-listing.component.html',
  styleUrls: ['./corporate-employee-listing.component.scss']
})
export class CorporateEmployeeListingComponent implements OnInit, AfterViewInit, OnDestroy {

  settings:any;

  corporateEmployeeList$: Observable<any>;
  private updateCorporateEmployeeList$ = new Subject<null>();
  userInfo: any;
  permissionApiResult: any;
  source: LocalDataSource;
  ownDetails: Array<any> = [];
  loading: boolean = false;
  constructor(private readonly corporateEmployeeService: CorporateEmployeeService,
    private readonly router: Router,
    private readonly dialog: NbDialogService, private readonly storageService: StorageService,
    private readonly activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.userInfo = this.storageService.getItems('userInfo');
    let profileDetails = this.storageService.getItems('profileDetail');
    this.permissionApiResult = profileDetails[0]?.permissionsList.filter((list) => list === 'corporate-read-only');
    const parentParam = this.activatedRoute.parent.snapshot.params;
    if(this.userInfo?.userType.toLowerCase() === 'corporateadmin' || this.userInfo?.userType.toLowerCase() === 'agencyadmin') {
      this.corporateEmployeeList$ = this.updateCorporateEmployeeList$.pipe(
        tap(() => this.loading = true),
        switchMap(() => this.corporateEmployeeService.fetchCorporateEmployees(parentParam.id, parentParam.corpId)),
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
          columns: {
            name: {
              title: 'Name',
              type: 'string',
            },
            description: {
              title: 'Description',
              type: 'string',
            },
            permissionsList: {
              title: 'Permission List',
              type:'custom',
              action: false,
              valuePrepareFunction: (value, row, cell) => {
                // DATA FROM HERE GOES TO renderComponent
                return value;
              },
              renderComponent: PermissionListComponent,
            },
            link: {
              title: 'More Info',
              type: 'custom',
              actions: false,
              renderComponent: ViewDetailComponent
            }
          },
        };
    } else {
      this.loading = true;
      if(this.userInfo?.userType.toLowerCase() === 'corporateemployee' && this.permissionApiResult != null) {
        this.corporateEmployeeService.getCorporateEmployeeProfile(parentParam.id, parentParam.corpId, this.userInfo?.profileId)
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
            edit:false,
            delete:false
          },
          columns: {
            name: {
              title: 'Name',
              type: 'string',
              filter: false
            },
            description: {
              title: 'Description',
              type: 'string',
              filter: false
            },
            custom: {
              title: 'Permission List',
              type:'custom',
              filter: false,
              action: false,
              renderComponent: PermissionListComponent
            },
            link: {
              title: 'More Info',
              type: 'custom',
              filter: false,
              actions: false,
              renderComponent: ViewDetailComponent
            }
          },
        };
      } else {
        this.loading = false;
        this.dialog.open(SuccessDialogComponent, {
          context: {
            title: 'Employee Profile Access',
            message: 'permission does not exist for this corporate employee.'
          }
        }).onClose.subscribe((res) => this.router.navigate(['/dashboard']))
      }
    }
  }

  onDeleteConfirm(event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Profile',
        message: 'Are you sure want to delete ?'
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          this.corporateEmployeeService.deleteCorporateEmployee(parentParam.id,event.data).subscribe(() => {
            this.dialog.open(SuccessDialogComponent, {
              context: {
                title: 'Delete Profile',
                message: 'Profile deleted successfully.'
              }
            }).onClose.subscribe((res) => this.updateCorporateEmployeeList$.next());
          },
          (error) => {
            this.dialog.open(SuccessDialogComponent, {
              context: {
                title: 'Delete Profile',
                message: 'Some error occurred, Please contact your administrator.'
              }
            })
          }
          )
        }
      })
      ).subscribe((res) => this.updateCorporateEmployeeList$.next());
  }



  selectedRow($event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/employee-profile/${$event.data.id}`]);
  }

  ngAfterViewInit() {
    this.updateCorporateEmployeeList$.next();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.updateCorporateEmployeeList$.complete();
  }
}
