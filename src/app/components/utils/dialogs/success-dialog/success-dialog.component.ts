import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  constructor(private readonly dialogRef: NbDialogRef<SuccessDialogComponent>) { }

  ngOnInit(): void {
  };

  dismiss() {
    this.dialogRef.close();
  };
}
