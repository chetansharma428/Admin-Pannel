import { StorageService } from './../../../../lib/services/storage-service/storage.service';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ViewwalletComponent } from './viewwallet/viewwallet.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../../utils/dialogs/success-dialog/success-dialog.component';
import { CorporateService } from '../../../../lib/services/corporate-service/corporate/corporate.service';
import { LocalDataSource } from 'ng2-smart-table';
import { BranchSavingService } from '../../../../lib/services/login-status/branch-saving.service';
import { MoreInfoComponent } from '../../../utils/more-info/more-info.component';

@Component({
  selector: 'ngx-corporate-listing',
  templateUrl: './corporate-listing.component.html',
  styleUrls: ['./corporate-listing.component.scss']
})


export class CorporatelistingComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {

  @Input() checked: boolean;
  settings: any;
  corporateList$: Observable<any>;
  private updateCorporateList$ = new Subject<null>();
  searchInput: string;
  userInfo: any;
  ownDetails: Array<any> = [];

  source: LocalDataSource;
  branchDetails: any;
  branchId: any;
  loadingLargeGroup: boolean = false;
  pagesize = ['10','20','30','40'];
  constructor(private readonly corporateService: CorporateService,
    private readonly router: Router, private readonly dialog: NbDialogService,
    private readonly activatedRoute: ActivatedRoute, private storageService: StorageService,
    private readonly branchStatusService: BranchSavingService, private cdRef: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateCorporateList$.next();
  };

  searchId(){
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.corporateList$ =  this.corporateService.fetchCorporates(parentParam, this.branchId,this.searchInput);
    return;
  }
  ngOnInit() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    let profileDetails = this.storageService.getItems('profileDetail');
    this.userInfo = this.storageService.getItems('userInfo');

    let params = {
      id: parentParam.id,
      corpId: this.userInfo?.corporateId
    }

    this.branchId = this.storageService.getItems('branchDetail')?.id;
    this.branchId = this.storageService.getItems('branchDetail')?.id || this.branchDetails;
    if (this.userInfo?.userType.toLowerCase() === 'agencyadmin') {
      this.corporateList$ = this.updateCorporateList$.pipe(
        tap(() => this.loadingLargeGroup = true),
        switchMap(() => this.corporateService.fetchCorporates(parentParam, this.branchId)),
        map((res:any) => {
          if(this.checked) {
            res.items = res.items.filter(ele => !ele.isActive && ele.accountLedgerCodes.length === 0);
            return res;
          }
          this.loadingLargeGroup = false;
          return res;
        },
        (error) => {
          this.loadingLargeGroup = false;
        }
        ),
        tap(() => this.loadingLargeGroup = false),
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
          id: { title: 'Id', type: 'string', filter: false },
          name: { title: 'Name', type: 'string', filter: false },
          emailId: { title: 'E-mail', type: 'string', filter: false },
          isActive: {
            title: 'Status',
            type: 'custom',
            filter: false,
            renderComponent: ToggleButtonComponent,
            onComponentInitFunction: (instance: any) => {
              this.onUpdateConfirm(instance);
            }
          },
          custom: {
            title: 'Wallet Status',
            type: 'custom',
            filter: false,
            renderComponent: ViewwalletComponent
          },
          link: {
            title: 'More Info',
            type: 'custom',
            actions: false,
            filter: false,
            renderComponent: MoreInfoComponent,
            onComponentInitFunction: (instance: any) => {
              instance.toggleResponse.subscribe(res => {
                this.router.navigate([`${res.parentId}/corporate/${res.id}/profile`], { queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge' })
              });
            }
          }
        },
        pager:{
          perPage:10
        }
      };
    } else if (this.userInfo?.userType.toLowerCase() === 'corporateadmin') {
      this.branchId = this.storageService.getItems('corporateDetails')?.associatedOrgId;
      this.loadingLargeGroup = true;
      this.corporateService.fetchCorporatedata(params, this.branchId).pipe().subscribe((res) => {
        this.ownDetails.push(res);
        this.loadingLargeGroup = false;
        this.source = new LocalDataSource(this.ownDetails);
      },
      (error) => {
        this.loadingLargeGroup = false;
      }
      )
      this.settings = {
        mode: 'external',
        actions: {
          add: false,
          delete: false
        },
        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>'
        },
        columns: {
          id: { title: 'search', type: 'string', filter: false },
          name: { title: 'Name', type: 'string', filter: false },
          emailId: { title: 'E-mail', type: 'string', filter: false },
          custom: { title: 'Wallet Status', type: 'custom', actions: false, filter: false, renderComponent: ViewwalletComponent },
          link: {  title: 'More Info', type: 'custom', actions: false,
            filter: false,
            renderComponent: MoreInfoComponent,
            onComponentInitFunction: (instance: any) => {
              instance.toggleResponse.subscribe(res => {
                this.router.navigate([`${res.parentId}/corporate/${res.id}/profile`], { queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge' })
              });
            }
          }
        }        
      };
    } else {
      this.loadingLargeGroup = true;
      this.corporateService.fetchCorporatedata(params, this.branchId).subscribe((res) => {
        this.ownDetails.push(res);
        this.source = new LocalDataSource(this.ownDetails);
        this.loadingLargeGroup = false;
      },
      (error) => {
        this.loadingLargeGroup = false;
      }
      )

      this.settings = {
        mode: 'external',
        actions: {
          add: false,
          delete: false,
          edit: false
        },
        columns: {
          id: { title: 'Id', type: 'string', filter: false},
          name: { title: 'Name', type: 'string', filter: false },
          emailId: { title: 'E-mail', type: 'string', filter: false },
          isActive: { title: 'Status', type: 'custom', filter: false, renderComponent: ToggleButtonComponent,
          },
          link: {
            title: 'More Info',
            type: 'custom',
            actions: false,
            filter: false,
            renderComponent: MoreInfoComponent,
            onComponentInitFunction: (instance: any) => {
              instance.toggleResponse.subscribe(res => {
                this.router.navigate([`${res.parentId}/corporate/${res.id}/profile`], { queryParams: { mode: 'view-details' }, queryParamsHandling: 'merge' })
              });
            }
          }
        }
      };
    }


    this.branchStatusService.watchBranchSubject().subscribe((res) => {
      this.branchDetails = res;
      this.branchId = this.branchDetails;
      // this.storageService.setBranchDetail(this.branchId);
      this.updateCorporateList$.next();
    })

    this.cdRef.detectChanges();
  };

  onUpdateConfirm(instance): void {
    instance.toggleResponse.pipe(
      tap((res) => this.showConfirmDialog('Update Warning', 'Are you sure, do you want to update ?', res)),
    ).subscribe(res => res);
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
          this.corporateService.deleteCorporate(event.data).subscribe((res) => res);
          this.showDialog('Success', 'Corporate has been Deleted.');
        }
      })
    ).subscribe((res) => res);
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
          this.corporateService.updateCorporate(data.data).subscribe((res) => res);
          this.showDialog('Success', 'Corporate has been udpated.');
        } else {
          this.updateCorporateList$.next();
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
    }).onClose.subscribe((res) => this.updateCorporateList$.next());
  };

  selectedRow($event): void {
    const data = $event.data;
    this.router.navigate([`${data.parentId}/corporate/${data.id}/profile`]);
  };

  ngAfterViewInit() {
    this.updateCorporateList$.next();
    this.cdRef.detectChanges();
  };

  ngOnDestroy(): void {
    this.updateCorporateList$.complete();
  };
}
