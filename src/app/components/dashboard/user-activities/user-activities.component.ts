import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { UserActive, UserActivityData } from '../../../@core/data/user-activity';

@Component({
  selector: 'ngx-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss']
})
export class UserActivitiesComponent implements OnDestroy {

  private alive = true;

  // userActivity: UserActive[] = [];
  type = 'month';
  types = ['week', 'month', 'year'];
  currentTheme: string;

  @Input() data;
  @Input() loader: boolean;



  constructor(private themeService: NbThemeService,
    private userActivityService: UserActivityData) {
      this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });

    // this.getUserActivity(this.type);
  }

  ngOnInit(): void {
  }

  // getUserActivity(period: string) {
  //   this.userActivityService.getUserActivityData(period)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe(userActivityData => {
  //       this.userActivity = userActivityData;
  //     });
  // }

  ngOnDestroy() {
    this.alive = false;
  }

}
