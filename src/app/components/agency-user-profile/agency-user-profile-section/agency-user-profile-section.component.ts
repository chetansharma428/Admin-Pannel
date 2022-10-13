import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-agency-user-profile-section',
  templateUrl: './agency-user-profile-section.component.html',
  styleUrls: ['./agency-user-profile-section.component.scss']
})
export class AgencyUserProfileSectionComponent implements OnInit {

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  addProfile() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`agencies/${parentParam.id}/user-profile/createUserProfile`]);
  }

}
