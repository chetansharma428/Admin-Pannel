import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-branch-section',
  templateUrl: './branch-section.component.html',
  styleUrls: ['./branch-section.component.scss']
})
export class BranchSectionComponent implements OnInit {

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router) { }

  ngOnInit(): void {
  }

  register() {
    const parentParam = this.activatedRoute.parent.snapshot.params;
    this.router.navigate([`${parentParam.id}/branch/register`]);
  }

}
