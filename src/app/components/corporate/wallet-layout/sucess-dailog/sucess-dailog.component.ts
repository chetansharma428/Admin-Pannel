import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-sucess-dailog',
  templateUrl: './sucess-dailog.component.html',
  styleUrls: ['./sucess-dailog.component.scss']
})
export class SucessDailogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;

  constructor(protected ref: NbDialogRef<SucessDailogComponent>) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.ref.close();
  }

}
