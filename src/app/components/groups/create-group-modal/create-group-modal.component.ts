import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-create-group',
  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.scss']
})
export class CreateGroupComponent implements OnInit {

  @Input() title: string;

  constructor(protected ref: NbDialogRef<CreateGroupComponent>) { }

  ngOnInit(): void { }

  dismiss() {
    this.ref.close();
  }
  
  createGroup = new FormGroup({
    groupname: new FormControl(''),
    description: new FormControl(''),
    email: new FormControl('')
  })

  onSubmit() {
    console.log(this.createGroup.value)
  }
}
