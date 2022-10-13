import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BranchSavingService } from '../../../../lib/services/login-status/branch-saving.service';
import { ProvidersService } from '../../../../lib/services/providers.service/providers.service';
import { StorageService } from '../../../../lib/services/storage-service/storage.service';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Component({
  selector: 'ngx-providers-table',
  templateUrl: './providers-table.component.html',
  styleUrls: ['./providers-table.component.scss']
})
export class ProvidersTableComponent implements OnInit {

  @Input() loading: boolean;

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
      providerId: { title: 'Provider Id', type: 'string' },
      providerName: { title: 'Provider Name', type: 'string' },
      originApplication: { title: 'Origin Application', type: 'string' },
      targetBranch: {title: 'Target Branch', type: 'string'},
      link: {
        title: 'More Info',
        type: 'custom',
        filter: false,
        actions: false,
        renderComponent: ViewDetailsComponent
      }
    }
  }

  branchId: any;
  branchDetails: any;
  @Input() providersData: any;

  providerDetails$: Observable<any>;
  private providerList$ = new Subject<null>();

  constructor(private readonly activatedRoute: ActivatedRoute,
    private readonly branchStatusService: BranchSavingService,
    private storageService: StorageService,
    private readonly dialog: NbDialogService, private readonly providerService: ProvidersService) { }

  ngOnInit() {

  }

  onDeleteConfirm($event) {

  }

}
