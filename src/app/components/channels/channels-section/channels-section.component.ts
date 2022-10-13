import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { ChannelsService } from '../../../lib/services/channels.service/channels.service';
import { CorporateService } from '../../../lib/services/corporate-service/corporate/corporate.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-channels-section',
  templateUrl: './channels-section.component.html',
  styleUrls: ['./channels-section.component.scss']
})
export class ChannelsSectionComponent implements OnInit {

  searchData = new FormGroup({
    branch: new FormControl('', {
      validators: [Validators.required],
    }),
    corporate: new FormControl('', [ Validators.required ]),
  })

  loadingLargeGroup: boolean = false;
  branchDetails = [{id:'*', name: '*'}];
  corporateDetails: any;

  corporateId: any;
  branchId: any;
  channelsData: any;

  corporates$: Observable<any>;
  @ViewChild('item') accordion;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;

  loadingData: boolean = false
  channelApiData$: Observable<any>;

  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly storageService: StorageService,
    private readonly corporateService: CorporateService,
    private readonly branchService: BranchService,
    private readonly channelsService: ChannelsService, private readonly providerService: ProvidersService) { }

  ngOnInit() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.searchData.controls.corporate.disable();
      this.branchId = '*';
      this.corporateId = '*';
      let data = {
        branchId: this.branchId,
        corporateId: this.corporateId
      }
      this.storageService.dataForChannels(data);
      this.loadingData = true;
      this.channelsService.fetchChannelDetails(parentParam, this.branchId, this.corporateId).subscribe((res: any) => {
        this.channelsData = res;
        this.loadingData = false;
      },
      (error) => {
        this.loadingData = false;
      }
      )

    this.branchService.fetchBranches(parentParam.id).subscribe((res: any) => {
      res?.items.forEach(element => {
        this.branchDetails.push(element);
      });
    })

  }

  onBranchSelected(value: string) {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.branchId = value;
    this.corporateService.fetchCorporates(parentParam, this.branchId).subscribe((res1: any) => {
      this.corporateDetails = res1?.items;
    })
    this.searchData.controls.corporate.enable();
    this.searchData.controls.corporate.setValue('');
    fromEvent(this.corporate.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      filter(res => res.length >= 2),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((res: any) => {
      this.providerService.getCorporate(res, this.branchId, parentParam).subscribe(res => this.corporateDetails = res);
    });
  }

  getChannelData() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    let corporateIdfromfield = this.searchData.controls.corporate.value;
    this.corporateId = this.corporateDetails.filter((corporate) => corporate.name === corporateIdfromfield);
    console.log(this.corporateId);
    let data = {
      branchId: this.branchId,
      corporateId: this.corporateId[0].id
    }
    this.storageService.dataForChannels(data);
    this.loadingData = true;
      this.channelsService.fetchChannelDetails(parentParam, this.branchId, this.corporateId[0]?.id).subscribe((res: any) => {
        this.channelsData = res;
        this.loadingData = false;
      },
      (error) => {
        this.loadingData = false;
      }
      )
  }

  channelCreate() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/channels/create-channel`]);
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/configuration`]);
  }

}
