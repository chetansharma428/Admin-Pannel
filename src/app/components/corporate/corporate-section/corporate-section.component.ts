import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-corporate-section',
  templateUrl: './corporate-section.component.html',
  styleUrls: ['./corporate-section.component.scss']
})
export class CorporateSectionComponent implements OnInit {

  loggedInUser: any;
  checked: boolean;
  constructor(private readonly router: Router, private readonly storageService: StorageService, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loggedInUser = this.storageService.getItems('userInfo');
  }

  registerCorporate() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/corporate/register`]);
  }

  toggle($event) {
    this.checked = $event;
  }
}
