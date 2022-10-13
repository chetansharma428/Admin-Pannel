import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BranchService } from '../../../../lib/services/branch-service/branch.service';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { MoreInfoComponent } from '../../../utils/more-info/more-info.component';
import { ToggleButtonComponent } from '../../../utils/toggle-button/toggle-button.component';
@Component({
  selector: 'ngx-branch-listing',
  templateUrl: './branch-listing.component.html',
  styleUrls: ['./branch-listing.component.scss']
})
export class BranchListingComponent implements OnInit {
  agencyId;
  branchDetails: any;

  branchList$: Observable<any>;
  private updateBranchList$ = new Subject<null>();

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
      id: { title: 'Branch Id', type: 'string' },
      name: { title: 'Branch Name', type: 'string' },
      locationCode: { title: 'Location Code', type: 'string' },
      emailId: { title: 'Email', type: 'string' },
      isActive: {
        title: 'Status', type: 'custom',
        renderComponent: ToggleButtonComponent,
        onComponentInitFunction: (instance: any) => {
          this.onUpdateConfirm(instance);
        }
      },
      link: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        actions: false,
        renderComponent: MoreInfoComponent,
        onComponentInitFunction: (instance: any) => {
          instance.toggleResponse.subscribe(res => this.router.navigate([`${res.parentId}/branch/${res.id}/profile`], {queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge'}));
        }
      }
    },
  };

  loading: boolean = false;

  constructor(private readonly branchService: BranchService, private readonly activateRoute: ActivatedRoute,
    private readonly dialog: NbDialogService, private readonly router: Router, private cd: ChangeDetectorRef,
    private readonly storageService: StorageService,) { }

  ngOnInit(): void {
    const parentParam = this.activateRoute.parent.snapshot.params;

    this.branchList$ = this.updateBranchList$.pipe(
      tap(() => this.loading = true),
      switchMap(() => this.branchService.fetchBranches(parentParam.id)),
      map((res) => {
        return res;
      },
      (error) => {
        this.loading = false;
      }
      ),
      tap((res) => {this.loading = false; this.storageService.setBranchDetails(res)})
      );
  };

  ngAfterViewInit() {
    this.updateBranchList$.next();
    this.cd.detectChanges();
  };

  ngOnDestroy(): void {
    this.updateBranchList$.complete();
  };

  onUpdateConfirm(instance): void {
    instance.toggleResponse.pipe(
      tap((res) => this.showConfirmDialog('Update Warning', 'Are you sure, do you want to update ?', res)),
    ).subscribe(res => res);
  };

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
          this.branchService.updateBranch(data.data).subscribe((res) => res);
          this.showDialog('Success', 'Branch has been udpated.');
        } else {
          this.updateBranchList$.next();
        }
      })
    ).subscribe((res) => res);
  };

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    }).onClose.subscribe((res) => this.updateBranchList$.next());
  };

  onDeleteConfirm(event): void {
    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Warning',
        message: 'Are you sure, do you want to delete ?'
      },
    }).onClose.pipe(
      tap((res) => {
        if (res) {
          this.branchService.deleteBranch(event.data).subscribe((res) => res);
          this.showDialog('Success', 'Branch has been Deleted.');
        }
      })
    ).subscribe((res) => res);
  };

  selectedRow($event) {
    const data = $event.data;
    this.router.navigate([`${data.parentId}/branch/${data.id}/profile`]);
  }
}
