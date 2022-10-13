import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../lib/services/storage-service/storage.service';

@Component({
  selector: 'ngx-profile-section',
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss']
})


export class ProfileSectionComponent implements OnInit {
  userDetails: any;
  userInfo: any;
  loadingPageData: boolean = false;
  constructor(private storageService: StorageService, private readonly router: Router) { }

  ngOnInit(): void {
    this.loadingPageData = true;
    this.userDetails = this.storageService.getItems('loggedinUserdetails');
    this.userInfo = this.storageService.getItems('userInfo');
    this.loadingPageData = false;
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

}
