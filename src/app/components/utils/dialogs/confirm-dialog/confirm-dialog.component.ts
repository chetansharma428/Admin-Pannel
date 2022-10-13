import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;

  constructor(private readonly dialogRef: NbDialogRef<ConfirmDialogComponent>) { }

  ngOnInit(): void {
  };

  confirm() {
    this.dialogRef.close(true);
  };

  dismiss() {
    this.dialogRef.close();
  };

}
