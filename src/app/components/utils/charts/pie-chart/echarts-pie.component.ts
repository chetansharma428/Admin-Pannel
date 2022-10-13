import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { DashbaordService } from '../../../../lib/services/dashboard/dashbaord.service';

@Component({
  selector: 'ngx-echarts-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsPieComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() updatedData;
  @Input() dataName;
  @Input() color;
  options: any = {};
  themeSubscription: any;

  @Input() heading;

  constructor(private theme: NbThemeService) {
  }


  ngOnInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;
      this.options = {
        backgroundColor: '#fff',
        color: this.color,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.heading,
          textStyle: {
            color: '#000',
          },
        },
        series: [
          {
            name: this.dataName,
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: this.updatedData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: '#000',
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  // color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngAfterViewInit() {
    // console.log(this.bookingData);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
