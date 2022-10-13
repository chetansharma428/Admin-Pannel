import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-udpate-wallet',
  templateUrl: './update-wallet.component.html',
  styleUrls: ['./update-wallet.component.scss']
})
export class UpdateWalletComponent implements OnInit {

  @Input() title: string;
  @Input() data: any;

  defineCreditForm: FormGroup;

  constructor(private readonly dialogRef: NbDialogRef<UpdateWalletComponent>, private readonly fb: FormBuilder) { }

  ngOnInit(): void {
    this.defineCreditForm = this.fb.group({
      "definedCredit": [this.data.definedCredit, [Validators.required]],
      "thresholdPercent": [this.data.thresholdPercent, [Validators.required]],
    });
  };

  createWallet() {
    this.dialogRef.close(this.defineCreditForm.value);
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
