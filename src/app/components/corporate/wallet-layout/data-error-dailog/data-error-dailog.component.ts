import { Component, Inject, Input, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-data-error-dailog',
  templateUrl: './data-error-dailog.component.html',
  styleUrls: ['./data-error-dailog.component.scss']
})
export class DataErrorDailogComponent implements OnInit {

  @Input() showProgress: boolean;
  @Input() showError: boolean;
  @Input() disableClose: boolean;
  @Input() title: string;
  @Input() message: string;
  progress_bar: boolean;
  failedMessage: boolean;

  constructor(protected ref: NbDialogRef<DataErrorDailogComponent>) { }

  ngOnInit(): void {
    // this.progress_bar = this.showProgress ?? false;
    // this.failedMessage = this.data.showError ?? false;
  }

  dismiss() {
    this.ref.close();
  }

}

