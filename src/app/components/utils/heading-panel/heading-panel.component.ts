import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-heading-panel',
  templateUrl: './heading-panel.component.html',
  styleUrls: ['./heading-panel.component.scss']
})
export class HeadingPanelComponent implements OnInit {

  @Input() heading;

  constructor() { }

  ngOnInit(): void {
  }

}
