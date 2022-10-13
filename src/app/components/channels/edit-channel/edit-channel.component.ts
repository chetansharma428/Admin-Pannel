import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchSavingService } from '../../../lib/services/login-status/branch-saving.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent implements OnInit {

  queryParams: any;
  channelData: any;
  editChannel: FormGroup;
  permissionValues = [];
  idsData: any;
  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute,
    private readonly branchStatusService: BranchSavingService, private readonly storageService: StorageService, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if(Object.keys(params).length != 0 ){
        this.queryParams = params;
      } else {
        this.queryParams = false;
      }
    })
    this.idsData = this.storageService.getItems('dataForChannels');
    this.channelData = this.branchStatusService.channcelData;
    if(!this.channelData) {
      const parentParam = this.activatedRoute.parent.snapshot.params;
      this.router.navigate([`${parentParam.id}/channels`]);
    }
    this.setDatainForm(this.channelData)

  }

  setDatainForm(res) {
    this.editChannel = this.fb.group({
      channelid: [res?.ChannelId],
      branch: [this.idsData.branchId],
      corporate: [this.idsData.corporateId],
      batchsize: [res?.BatchSize]
    })
    // console.log(res);
    this.permissionValues = res?.Providers;
    if(this.queryParams) {
      this.editChannel.disable();
    }
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/channels`]);
  }

  keyPressAlphaNumericWithCharacters(event) {

    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-Z0-9-_@ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
