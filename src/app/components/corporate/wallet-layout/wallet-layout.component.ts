import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbTabComponent, NbTabsetComponent } from '@nebular/theme';
import { Observable } from 'rxjs';
import { DataErrorDailogComponent } from './data-error-dailog/data-error-dailog.component';
import { SucessDailogComponent } from './sucess-dailog/sucess-dailog.component';
import { map, tap } from 'rxjs/operators';
import { WalletServiceService } from '../../../lib/services/corporate-service/wallet/wallet-service.service';
import { ConfirmDialogComponent } from '../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { UpdateWalletComponent } from './update-wallet/update-wallet.component';

@Component({
  selector: 'ngx-wallet-layout',
  templateUrl: './wallet-layout.component.html',
  styleUrls: ['./wallet-layout.component.scss']
})
export class WalletLayoutComponent implements OnInit {

  corporateId: string;
  agencyId: string;
  walletId: string;
  corporateName: string;

  month: number;
  pageSize: number = 500;
  year: string;
  transactionRecord: any;

  addMoney = new FormGroup({
    defineCredit: new FormControl('', {
      validators: [Validators.required],
    }),
    remarks: new FormControl('', [Validators.required]),
    checked: new FormControl('')
  })

  transactionForm = new FormGroup({
    month: new FormControl(null, {
      validators: [Validators.required],
    }),
    year: new FormControl(null, {
      validators: [Validators.required]
    }),
  })

  walletBalance: any;
  definedCredit: any;
  thresholdPercent: any;
  status: boolean;

  allTransactionRecord: any;

  corporateData: any;
  userInfo: any;

  loading = false;
  loadingLargeGroup = false;

  loadingTable: boolean = false;

  walletData$: Observable<any>;

  currentCorporate$: Observable<any>;
  defineCreditForm: FormGroup;
  wallet: any;


  @ViewChild("tabset") tabsetEl: NbTabsetComponent;
  @ViewChild("selectedData") addTabEl: NbTabComponent;

  constructor(
    private readonly storageService: StorageService,
    private _dataErrorDailog: NbDialogService,
    private _SucessDailog: NbDialogService,
    private route: ActivatedRoute,
    private walletService: WalletServiceService,
    private readonly dialog: NbDialogService,
    private router: Router,
    private readonly walletServiceService: WalletServiceService) { }

  ngOnInit() {
    this.agencyId = this.route.snapshot.paramMap.get('agencyId');
    this.corporateId = this.route.snapshot.paramMap.get('corporateId');
    this.walletId = this.route.snapshot.paramMap.get('walletId');
    this.userInfo = this.storageService.getItems('userInfo');

    //login Corporate Data
    this.currentCorporate$ = this.walletService.walletParticularCorporate(this.agencyId, this.corporateId).pipe(
      tap(() => this.loading = true),
      map(res => res),
      tap(() => this.loading = false)
    )
    this.getWallet();
  }

  addMoneyFunction() {
    this.loadingLargeGroup = true;
    let Credit = Number(this.addMoney.get('defineCredit').value);
    let transactionMode = 'Credit';
    let remarks = this.addMoney.get('remarks').value
    this.walletService.addMoneyInWalletApi(this.agencyId, this.corporateId, this.walletId, Credit, transactionMode, remarks)
      .subscribe((data) => {
        this.walletData$ = this.walletService.walletMoneyApi(this.agencyId, this.corporateId, this.walletId);
        this.currentMonthFunction();
        this.addMoney.reset();
        this.loadingLargeGroup = false;
        this._SucessDailog.open(SucessDailogComponent, {
          context: {
            title: 'Wallet Recharge',
            message: 'Recharge done successfully'
          },
        });
      },
        (error) => {
          this.loadingLargeGroup = false;
          this._dataErrorDailog.open(DataErrorDailogComponent, {
            context: {
              title: 'Wallet Recharge',
              message: 'Recharge failed, Please contact your administrator'
            },
          });
          this.addMoney.reset();
        })

  }

  currentMonthFunction() {
    this.loadingTable = true;
    if (this.transactionForm.pristine || this.transactionForm.untouched) {
      let m = new Date().getMonth() + 1;
      let y = new Date().getFullYear().toString();
      this.month = m;
      this.year = y;
      this.transactionForm.patchValue({
        month: this.month.toString(),
        year: this.year,
      })
    } else {
      this.month = this.transactionForm.get('month').value;
      this.year = this.transactionForm.get('year').value;
    }

    this.walletService.corporateTransactionApi(this.agencyId, this.corporateId, this.walletId, this.month, this.year, this.pageSize)
      .subscribe((res) => {
        this.allTransactionRecord = res.items;
        this.transactionRecord = this.allTransactionRecord;
        this.loadingTable = false;
      },
        (error) => {
          this.loadingTable = false;
          console.log(error);
        }
      )
  }

  previousMonthFunction() {
    let m = new Date().getMonth();
    let y = new Date().getFullYear().toString();
    this.month = m;
    this.year = y;
    this.walletService.corporateTransactionApi(this.agencyId, this.corporateId, this.walletId, this.month, this.year, this.pageSize)
      .subscribe((res) => {
        this.allTransactionRecord = res.items;
        this.transactionRecord = this.allTransactionRecord;
      }, (error) => {
        console.log(error);
      }
      )
  }

  walletStatusFunction(status) {
    let statusWallet = status;
    var message;
    if (statusWallet) {
      message = 'Are you sure want to enable ?';
    } else {
      message = 'Are you sure want to disable ?';
    }

    this.dialog.open(ConfirmDialogComponent, {
      context: {
        title: 'Wallet enable/disable',
        message: message
      },
    }).onClose.subscribe((res) => {
      if (res) {
        if (statusWallet) {
          this.walletService.activateWallet(this.agencyId, this.corporateId, this.walletId).subscribe(() => {
            this.showDialog('Wallet enable/disable', 'Wallet enabled successfully');
          },
            (error) => {
              this.showDialog('Wallet enable/disable', 'Some error occurred, Please contact your administrator');
            }
          );
        } else {
          this.walletService.deactivateWallet(this.agencyId, this.corporateId, this.walletId).subscribe(() => {
            this.showDialog('Wallet enable/disable', 'Wallet disabled successfully')
          },
            (error) => {
              this.showDialog('Wallet enable/disable', 'Some error occurred, Please contact your administrator')
            }
          );
        }
      } else {
        this.addMoney.patchValue({
          checked: this.wallet.isActive
        });
      }
    })
  }

  showDialog(status, message) {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: status,
        message: message
      }
    }).onClose.subscribe((res) => {
      this.getWallet();
    })
  }

  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  onEvento($event) {
    this.loading = true;
    let tabTitle = $event.tabTitle;
    if (tabTitle === 'Previous Month') {
      this.previousMonthFunction();
      this.loading = false;
    } else if (tabTitle === 'Current Month') {
      this.currentMonthFunction();
      this.loading = false;
    } else if (tabTitle === "Credit Only Transactions") {
      this.transactionRecord = this.allTransactionRecord.filter((trans) => trans.transactionMode === 'Credit');
      this.loading = false;
    } else if(tabTitle === "Debit Only Transactions") {
      this.transactionRecord = this.allTransactionRecord.filter((trans) => trans.transactionMode === 'Debit');
      this.loading = false;
    } else if(tabTitle === "Custom") {
      this.loading = false;
    }
  }

  yearMonthFunction() {
    let month = this.transactionForm.get('month').value;
    let year = this.transactionForm.get('year').value;
    this.walletService.corporateTransactionApi(this.agencyId, this.corporateId, this.walletId, month, year, this.pageSize)
      .subscribe((res) => {
        this.allTransactionRecord = res.items;
        this.transactionRecord = this.allTransactionRecord;
        // this.tabsetEl.selectTab(this.addTabEl);
      },
        (error) => {
          console.log(error);
        }
      )
  }

  clear() {
    this.transactionForm.reset();
    this.currentMonthFunction();
  }

  back() {
    this.agencyId = this.route.snapshot.paramMap.get('agencyId');
    this.corporateId = this.route.snapshot.paramMap.get('corporateId');
    if (this.userInfo?.userType === 'agencyAdmin') {
      this.router.navigate([`${this.agencyId}/corporate/list`]);
    } else if (this.userInfo?.userType === 'corporateAdmin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  defineCredit() {
    this.dialog.open(UpdateWalletComponent, {
      context: {
        title: 'Update Wallet',
        data: this.wallet
      },
    }).onClose.pipe(
      tap((res) => {
        const request = {
          agency: this.agencyId,
          corpId: this.corporateId,
          walletId: this.walletId
        };
        this.walletServiceService.updateWallet(res, request).subscribe((res: any) => res);
      })
    ).subscribe((res) => {
      if (res) {
        this.getWallet();
      }
    });
  };

  getWallet() {
    this.walletData$ = this.walletService.walletMoneyApi(this.agencyId, this.corporateId, this.walletId).pipe(
      tap(() => this.loading = true),
      map((res: any) => {
        this.wallet = res;
        this.addMoney.patchValue({
          checked: this.wallet.isActive
        });
        return res;
      }),
      tap(() => this.loading = false)
    );
  };
}
