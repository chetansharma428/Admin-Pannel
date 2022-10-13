import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbTagComponent } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { ChannelsService } from '../../../lib/services/channels.service/channels.service';
import { CorporateService } from '../../../lib/services/corporate-service/corporate/corporate.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { SuccessDialogComponent } from '../../utils/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'ngx-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddChannelComponent implements OnInit {

  filteredOptions: string[] = [];

  option: any;

  @ViewChild('autoInput') input;

  permissionValues = [];

  permissionName: boolean;
  branchId: any;
  providersData: Array<any> = [];
  tagDetails: Array<any> = [];
  mainData: any;

  addChannel = new FormGroup({
    channelid: new FormControl('', {
      validators: [Validators.required],
    }),
    batchsize: new FormControl('', [Validators.required]),
  })

  loading: boolean = false;
  corporateId: any;

  branchDetails: any;
  corporateDetails: any;
  options: string[];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly providerService: ProvidersService,
    private readonly storageService: StorageService,
    private readonly channelService: ChannelsService,
    private dailog: NbDialogService,
    private readonly corporateService: CorporateService,
    private readonly branchService: BranchService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchService.fetchBranches(parentParam.id).subscribe((res: any) => {
      this.branchDetails = res?.items
    })
  }

  onBranchSelected(value: string) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchId = value;
    this.corporateService.fetchCorporates(parentParam, this.branchId).subscribe((res1: any) => {
      this.corporateDetails = res1?.items;
    })

  }

  onCorporateSelected(value: string) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.corporateId = value;
    this.providerService.fetchProviderDetails(parentParam, this.branchId, this.corporateId).subscribe((res: any) => {
      this.mainData = res.Settings;
      this.filteredOptions = this.providersData = res.Settings;
      this.ref.detectChanges();
    })
  }

  viewHandle(value: string) {
    return value.toUpperCase();
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.providersData.filter(optionValue => optionValue.providerId.toLowerCase().includes(filterValue));
  }

  getFilteredOptions(value: string): string[] {
    return this.filter(value)
  }

  onChange() {
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value);
  }

  onSelectionChange($event) {
    this.permissionValues.push($event);
    this.permissionName = true;
    this.providersData = this.providersData.filter(t => t.providerId !== $event);
    this.filteredOptions = this.providersData;
    this.filteredOptions = this.getFilteredOptions(this.input.nativeElement.value = '');
    ;
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.mainData.forEach(element => {
      if(element.providerId === tagToRemove.text)
      {
        this.providersData.push(element);
      }
    });

    this.providersData.sort((first, secound) => first > secound ? 1 : -1);
    this.filteredOptions = this.providersData;
    this.permissionValues = this.permissionValues.filter(t => t !== tagToRemove.text);
    if(this.permissionValues.length === 0) {
      this.permissionName = false;
    }
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

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/channels`]);
  }

  addChannelFunction() {
    this.loading = true;
    let data = this.addChannel.value;
    let channelId = data.channelid;
    let batchSize = data.batchsize;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    if((this.addChannel.invalid || this.addChannel.pristine) || this.permissionValues.length === 0) {
      this.loading = false;
      this.dailog.open(SuccessDialogComponent, {
        context: {
          title: 'Warning',
          message: 'Please fill the form !'
        }
      })
    } else {
      this.channelService.createChannelApi(parentParam, this.branchId, this.corporateId, channelId, batchSize, this.permissionValues)
      .subscribe((res) => {
        this.addChannel.reset();
        this.permissionValues = [];
        this.loading = false;
        this.dailog.open(SuccessDialogComponent, {
          context: {
            title: 'Message',
            message: 'Channel created successfully !'
          }
        }).onClose.subscribe((res) => {
          this.router.navigate([`${parentParam.id}/channels`]);
        })
      },
      (error) => {
        this.loading = false;
        this.dailog.open(SuccessDialogComponent, {
          context: {
            title: 'Message',
            message: 'Some error occurred, Please contact your administrator.'
          }
        })
      }
      )
    }

  }

}
