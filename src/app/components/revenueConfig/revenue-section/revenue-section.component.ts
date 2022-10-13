import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { BranchService } from '../../../lib/services/branch-service/branch.service';
import { CorporateService } from '../../../lib/services/corporate-service/corporate/corporate.service';
import { ProvidersService } from '../../../lib/services/providers.service/providers.service';
import { RevenueService } from '../../../lib/services/revenue.service/revenue.service';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-revenue-section',
  templateUrl: './revenue-section.component.html',
  styleUrls: ['./revenue-section.component.scss']
})
export class RevenueSectionComponent implements OnInit {

  corporateData:any;
  corporateId: any;
  branchId: any;
  revenueData: any;
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
  loading: boolean = false;


  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly storageService: StorageService,
    private readonly corporateService: CorporateService,
    private readonly branchService: BranchService,
    private readonly revenueService: RevenueService,
    private readonly providerService: ProvidersService) { }

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
      this.revenueService.fetchRevenueData(parentParam, this.branchId, this.corporateId).subscribe((res: any) => {
        this.revenueData = res;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
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
      filter(res => res.length > 2),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((res: any) => {
      this.providerService.getCorporate(res, this.branchId, parentParam).subscribe(res => this.corporateDetails = res);
    });
  }

  getChannelData() {
    this.loading = true;
    const parentParam = this.activatedRoute.parent.snapshot.params;
    let corporateIdfromfield = this.searchData.controls.corporate.value;
    this.corporateId = this.corporateDetails.filter((corporate) => corporate.name === corporateIdfromfield);
    let data = {
      branchId: this.branchId,
      corporateId: this.corporateId[0]?.id
    }
    this.storageService.dataForChannels(data);
    this.revenueService.fetchRevenueData(parentParam, this.branchId, this.corporateId[0]?.id).subscribe((res: any) => {
      this.revenueData = res;
      this.loading = false;
    },
    (error) => {
      this.loading = false;
    }
    )
  }

  back() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/configuration`]);
  }

  createRuleSet() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/revenue/add-revenue-rule-set`])
  }

}
