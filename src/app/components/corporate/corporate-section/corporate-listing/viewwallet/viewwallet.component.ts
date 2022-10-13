import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ViewCell } from 'ng2-smart-table';
import { tap } from 'rxjs/operators';
import { WalletServiceService } from '../../../../../lib/services/corporate-service/wallet/wallet-service.service';
import { SuccessDialogComponent } from '../../../../utils/dialogs/success-dialog/success-dialog.component';
import { CreateWalletComponent } from '../create-wallet/create-wallet.component';

@Component({
  selector: 'ngx-viewwallet',
  template: `<div *ngIf="rowData?.walletId && rowData?.isActive else create"><a href="javascript:void(0)" (click)="onClick($event)">View Wallet</a></div>
  <ng-template #create>
    <div *ngIf="!rowData?.walletId && rowData?.isActive else noWallet">
      <a class="wallet-info" href="javascript:void(0)" (click)="onClick($event)">Create wallet</a>
    </div>
    <ng-template #noWallet>
      <a class="wallet-info" href="javascript:void(0)" (click)="noWalletexist($event)">
        <nb-icon style="height: 20px; width: 20px; margin-left: 5px" icon="slash-outline"></nb-icon>
      </a>
    </ng-template>
  </ng-template>` 
})

export class ViewwalletComponent implements OnInit, ViewCell {

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, private readonly dialog: NbDialogService,
    private readonly walletServiceService: WalletServiceService) { }

  @Input() value;
  @Input() rowData;

  ngOnInit(): void {};

  onClick($event?): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    $event.stopPropagation();
    if (this.rowData?.walletId && $event) {
      this.router.navigate([`${parentParam.id}/corporate/${this.rowData.parentId}/corporateId/${this.rowData.id}/walletId/${this.rowData.walletId}`]);
    } else {
      this.dialog.open(CreateWalletComponent, {
        context: {
          title: 'Create Wallet'
        },
      }).onClose.pipe(
        tap((res) => {
            this.walletServiceService.createWallet(res, parentParam.id, this.rowData.id).subscribe((res: any) =>            
            this.router.navigate([`${parentParam.id}/corporate/${this.rowData.parentId}/corporateId/${this.rowData.id}/walletId/${res.walletId}`]));
        })
      ).subscribe((res) => res);
    }
  };

  noWalletexist($event): void {
    this.dialog.open(SuccessDialogComponent, {
      context: {
        title: 'Wallet Message',
        message: 'Wallet does not exist for this corporate'
      },
    })
  }
}
