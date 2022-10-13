import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { tap } from 'rxjs/operators';
import { ChannelsService } from '../../../../lib/services/channels.service/channels.service';
import { BranchSavingService } from '../../../../lib/services/login-status/branch-saving.service';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { ProvidersListComponent } from './providers-list/providers-list.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Component({
  selector: 'ngx-channel-table',
  templateUrl: './channel-table.component.html',
  styleUrls: ['./channel-table.component.scss']
})
export class ChannelTableComponent implements OnInit {

  settings = {
    mode: 'external',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      ChannelId: { title: 'Channel Id', type: 'string' },
      BatchSize: { title: 'Batch Size', type: 'string' },
      Providers: {
        title: 'Providers',
        type: 'custom',
        actions: false,
        renderComponent: ProvidersListComponent
      },
      link: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        actions: false,
        renderComponent: ViewDetailsComponent
      }
    }
  }

  @Input() branchId: any;
  @Input() branchDetails: any;
  @Input() channelsData: any;
  @Input() loadingData: boolean;

  constructor(private readonly channelsService: ChannelsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly branchStatusService: BranchSavingService,
    private storageService: StorageService,
    private readonly dialog: NbDialogService,) { }

  ngOnInit(): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchId = this.storageService.getItems('branchDetail')?.id;
  }

  onDeleteConfirm(event): void {
  //   const parentParam = this.activatedRoute.parent.snapshot.params;
  //   this.branchId = this.storageService.getItems('branchDetail')?.id;
  //   this.dialog.open(ConfirmDialogComponent, {
  //     context: {
  //       title: 'Delete Warning',
  //       message: 'Are you sure want to delete ?'
  //     },
  //   }).onClose.pipe(
  //     tap((res) => {
  //       if (res) {
  //         this.channelsService.deleteChannel(parentParam, this.branchId).subscribe((res) => {
  //           this.showDialog('Success', 'Channel deleted successfully !')
  //         },
  //         (error) => {
  //           this.showDialog('Failure', 'Some error occurred, Please contact your administrator.')
  //         }
  //         )
  //       }
  //     })
  //   ).subscribe((res) => res);
  };

}
