import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { DashbaordService } from '../../../../lib/services/dashboard/dashbaord.service';

@Component({
  selector: 'ngx-chartjs-pie',
  template: `
    <div [nbSpinner]="loader" nbSpinnerStatus="primary" nbSpinnerSize="large">
      <chart type="pie" [data]="data" [options]="options"></chart>
    </div>
  `,
})
export class ChartjsPieComponent implements OnInit, OnDestroy {
  data: any;
  options: any;
  themeSubscription: any;
  bookingData: any;
  productType = "Flight";
  @Input() flightOption;
  @Input() domecticAndInternationalResult;
  color:Array<any>;
  @Input() loader: boolean;

  constructor(private theme: NbThemeService) {

  }

  ngOnInit() {
    if(this.domecticAndInternationalResult[0] === 0 && this.domecticAndInternationalResult[1] === 0) {
      this.domecticAndInternationalResult = [0];
      this.flightOption = ['No Data'];
      this.color = ['#d3d3d3']
    } else {
      this.color = ['#ffa36b', '#ffc94d']
    }
    this.pieChart();
  }

  pieChart() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels: this.flightOption,
        datasets: [{
          data: this.domecticAndInternationalResult,
          backgroundColor: this.color,
        }],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          labels: {
            color: '#000000',
          },
        },
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
