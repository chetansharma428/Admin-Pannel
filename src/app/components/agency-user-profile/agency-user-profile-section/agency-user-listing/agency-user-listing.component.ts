import { PermissionListComponent } from './permission-list/permission-list.component';
import { map, switchMap, tap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { UserProfileService } from '../../../../lib/services/agency-service/user-profile/user-profile.service';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';

@Component({
  selector: 'ngx-agency-user-listing',
  templateUrl: './agency-user-listing.component.html',
  styleUrls: ['./agency-user-listing.component.scss']
})
export class AgencyUserListingComponent implements OnInit, AfterViewInit, OnDestroy {

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
        onComponentInitFunction: (instance) => {
          // console.log(instance)
        }
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

  loading: boolean = false;
  agencyUserProfiles$: Observable<any>;
  private updateAgencyUserProfileList$ = new Subject<null>();

  constructor(private readonly agencyUserProfileService: UserProfileService,
    private readonly activatedRoute: ActivatedRoute, private readonly dialog: NbDialogService,
    private readonly router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.agencyUserProfiles$ = this.updateAgencyUserProfileList$.pipe(
      tap(() => this.loading = true),
      switchMap(() => this.agencyUserProfileService.fetchAgenciesProfile(parentParam.id)),
      map((res) => {
        return res;
      },
      (error) => {
        this.loading =  false;
      }
      ),
      tap(() => this.loading = false),
    )
  }

  onDeleteConfirm(event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Warning',
        message: 'Are you sure, you want to delete ?'
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          this.agencyUserProfileService.deleteAgencyUserProfile(parentParam.id,event.data).subscribe(() => {
            this.dialog.open(SuccessDialogComponent, {
              context: {
                title: 'Delete Profile',
                message: 'Profile Deleted Successfully.'
              }
            }).onClose.subscribe((res) => this.updateAgencyUserProfileList$.next());
          },
          (error) => {
            this.dialog.open(SuccessDialogComponent, {
              context: {
                title: 'Delete Profile',
                message: 'error occurred. Contact administrator.'
              }
            })
          }
          )
        }
      })
      ).subscribe((res) => res);
  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    }).onClose.subscribe((res) => this.updateAgencyUserProfileList$.next());
  }

  selectedRow($event): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`agencies/${parentParam.id}/user-profile/updateProfile/${$event.data.id}`]);
  }

  ngAfterViewInit() {
    this.updateAgencyUserProfileList$.next();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.updateAgencyUserProfileList$.complete();
  }

}
