import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-policy-section',
  templateUrl: './policy-section.component.html',
  styleUrls: ['./policy-section.component.scss']
})
export class PolicySectionComponent implements OnInit {

  singleSelectGroupValue = [];
  flight: boolean = true;
  hotel: boolean = false;
  valueOption: any;
  loginUserInfo: any;
  constructor(private readonly storageService: StorageService, private router: Router, private cd: ChangeDetectorRef, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loginUserInfo = this.storageService.getItems('userInfo');
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

  updateSingleSelectGroupValue(value): void {
    if(value = 'Flight') {
      this.flight = true;
      this.hotel = false;
    } else {
      this.hotel = true;
      this.flight = false
    }
    this.singleSelectGroupValue = value;
    this.valueOption = value;
    this.cd.markForCheck();
  }

  add_Policy() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/${parentParam.corpId}/policy/add_Policy`]);
  }

}
