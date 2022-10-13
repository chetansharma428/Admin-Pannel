import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { CorporateService } from '../../../lib/services/corporate-service/corporate/corporate.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'ngx-provider-config-section',
  templateUrl: './provider-config-section.component.html',
  styleUrls: ['./provider-config-section.component.scss']
})
export class ProviderConfigSectionComponent implements OnInit {

  corporateData:any;
  corporateId: any;
  branchId: any;
  providersData: any;
  loadingLargeGroup: boolean = false;
  branchDetails = [{id:'*', name: '*'}];
  corporateDetails: any;

  searchData = new FormGroup({
    branch: new FormControl('', {
      validators: [Validators.required],
    }),
    corporate: new FormControl('', [ Validators.required ]),
  })

  @ViewChild('item') accordion;
  @ViewChild('corporate', { static: true }) corporate: ElementRef;

  corporates$: Observable<any>;
  providersApiData$: Observable<any>;
  loading: boolean = false;

  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly storageService: StorageService,
    private readonly corporateService: CorporateService,
    private readonly branchService: BranchService, private readonly providerService: ProvidersService) { }

  ngOnInit(): void {
    const parentParam = this.activatedRoute.parent.snapshot.params;
      this.branchId = '*';
      this.corporateId = '*';
      let data = {
        branchId: this.branchId,
        corporateId: this.corporateId
      }
      this.searchData.controls.corporate.disable();
      this.storageService.dataForChannels(data);
      this.loading = true;
      this.providerService.fetchProviderDetails(parentParam, this.branchId, this.corporateId).subscribe((res) => {
        this.providersData = res;
        this.loading = false;
      }, (error) => {
        this.loading = false;
      })
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
    let data = {
      branchId: this.branchId,
      corporateId: this.corporateId.id
    }
    this.storageService.dataForChannels(data);
    this.loading = true;
    this.providerService.fetchProviderDetails(parentParam, this.branchId, this.corporateId[0]?.id).subscribe((res: any) => {
      this.providersData = res;
      this.loading = false;
    }, (error) => {
      this.loading = false;
    })
  }

  createProvider() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/providers/add-provider`])
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/configuration`]);
  }

}
