import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-agency-staff-list',
  templateUrl: './agency-staff-list.component.html',
  styleUrls: ['./agency-staff-list.component.scss']
})
export class AgencyStaffListComponent implements OnInit {
  pagesize = ['10','20','30','40'];
  searchInput:string;
  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) { }
  searchemail(){

  }
  ngOnInit(): void { }

  addAgencystaff(){
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`agency/${parentParam.id}/staff/add`]);
  };

}
