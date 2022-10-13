import { Component, Input } from "@angular/core";
import { multi } from "../../../../@core/data/graph";



@Component({
  selector: 'ngx-bar-echart',
  template: `
    <div [nbSpinner]="loader" nbSpinnerStatus="primary" nbSpinnerSize="large">
      <ngx-charts-bar-vertical-stacked
        [view]="view"
        [scheme]="this.data[0].name === 'No Data' ? color : colorScheme"
        [results]="data"
        [gradient]="gradient"
        [xAxis]="showXAxis"
        [legendTitle]="legendTitle"
        [yAxis]="showYAxis"
        [legend]="showLegend"
        [showXAxisLabel]="showXAxisLabel"
        [showYAxisLabel]="showYAxisLabel"
        [xAxisLabel]="xAxisLabel"
        [yAxisLabel]="yAxisLabel"
        [animations]="animations"
        (select)="onSelect($event)">
      </ngx-charts-bar-vertical-stacked>
    </div>

  `,
})

export class BarEchartComponent {

  multi: any[];
  view: any[] = [1000, 400];
  @Input() loader: boolean;

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Total Sales';
  animations: boolean = true;
  legendTitle: string = 'Corporate';
  @Input() data;

  colorScheme = {
    domain: ['#598bff','#ffc94d', '#5dcfe3', '#2ce69b', '#ff6b83', '#ffa36b', '#5dcfe3', '#2ce69b']
  };

  color = {
    domain: ['#d3d3d3']
  };


  constructor() {
    // console.log(this.corporateDateViseData);
    Object.assign(this, { multi });
  }

  onSelect(event) {
    console.log(event);
  }
}
