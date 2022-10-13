import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ProgressInfo, StatsProgressBarData } from '../../../@core/data/stats-progress-bar';

@Component({
  selector: 'ngx-progress-section',
  templateUrl: './progress-section.component.html',
  styleUrls: ['./progress-section.component.scss']
})
export class ProgressSectionComponent implements OnDestroy {

  private alive = true;

  @Input() sales;
  @Input() booking;
  @Input() loader: boolean;

  progressInfoData: ProgressInfo[];

  constructor(private statsProgressBarService: StatsProgressBarData) {
    this.statsProgressBarService.getProgressInfoData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.progressInfoData = data;
      });
  }

  ngOnInit(): void {
    // this.loader = true;
    // if(this.sales && this.booking) {
    //   this.loader = false;
    // }
  }

  ngOnDestroy() {
    this.alive = true;
  }

}
