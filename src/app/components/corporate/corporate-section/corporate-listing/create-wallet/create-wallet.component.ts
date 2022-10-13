import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  createWalletForm: FormGroup;

  constructor(private readonly dialogRef: NbDialogRef<CreateWalletComponent>, private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.createWalletForm = this.fb.group({
      "definedCredit": [null, [Validators.required]],
      "thresholdPercent": [null, [Validators.required]],
    });
  };

  createWallet() {
    this.dialogRef.close(this.createWalletForm.value);
  };

  dismiss() {
    this.dialogRef.close();
  };

  /**Only Integer Numbers**/
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  };
}
