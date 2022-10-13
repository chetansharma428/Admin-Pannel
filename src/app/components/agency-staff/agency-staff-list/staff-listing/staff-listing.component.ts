import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { StaffService } from '../../../../lib/services/agency-service/staff/staff.service';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Component({
  selector: 'ngx-staff-listing',
  templateUrl: './staff-listing.component.html',
  styleUrls: ['./staff-listing.component.scss']
})
export class StaffListingComponent implements OnInit {

  agencyStaffList$: Observable<any>;
  private updateAgencystafflist$ = new Subject<null>();

  settings = {
    mode: 'external',
    actions: {
      add: false
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      firstName: { title: 'First Name', type: 'string', filter: false },
      lastName: { title: 'Last Name', type: 'string', filter: false },
      emailId: { title: 'Email', type: 'string', filter: false },
      link: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        actions: false,
        renderComponent: ViewDetailsComponent
      }
    },
  };

  loading: boolean = false;

  constructor(private readonly activateRoute: ActivatedRoute,
    private readonly dialog: NbDialogService,
    private readonly router: Router,
    private staffService: StaffService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const parentParam = this.activateRoute.parent.snapshot.params;

    this.agencyStaffList$ = this.updateAgencystafflist$.pipe(
      tap(() => this.loading = true),
      switchMap(() => this.staffService.fetchAgencyStaff(parentParam.id)),
      map((res) => {
        return res;
      },
      (error) => {
        this.loading = false;
      }
      ),
      tap(() => this.loading = false)
      );
  };

  ngAfterViewInit() {
    this.updateAgencystafflist$.next();
    this.cd.detectChanges();
  };

  ngOnDestroy(): void {
    this.updateAgencystafflist$.complete();
  };

  onUpdateConfirm(instance) {
    instance.toggleResponse.pipe(
      tap((res) => this.showConfirmDialog('Update Warning', 'Are you sure, do you want to update ?', res)),
    ).subscribe(res => res);
  }

  showConfirmDialog(status, message, data?) {
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: status,
        message: message
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          data.data.isActive = data.status;
          this.staffService.updateAgencyStaff(data.data).subscribe((res) => res);
          this.showDialog('Success', 'Branch has been udpated.');
        } else {
          this.updateAgencystafflist$.next();
        }
      })
    ).subscribe((res) => res);
  };

  selectedRow($event): void {
    const data = $event.data;
    this.router.navigate([`agency/${data.parentId}/staff/update-Details/${data.emailId}`]);
  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    }).onClose.subscribe((res) => this.updateAgencystafflist$.next());
  }

  onDeleteConfirm(event): void {
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Warning',
        message: 'Are you sure, do you want to delete ?'
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          this.staffService.deleteAgencyStaff(event.data).subscribe((res) => res);
          this.showDialog('Success', 'Agency user has been Deleted.');
        }
      })
    ).subscribe((res) => res);
  };

}
