import { NgModule } from '@angular/core';
import { NbMenuModule, NbCardModule, NbActionsModule, NbTabsetModule, NbSelectModule, NbSpinnerModule, NbProgressBarModule, NbListModule, NbDatepickerModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { DashboardComponent } from './dashboard.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbIconModule } from '@nebular/theme';
import { ChartModule } from 'angular2-chartjs';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LayoutComponent } from './layout/layout.component';
import { ChartjsLineComponent } from './../utils/charts/line-chart/chartjs-line.component';
import { ChartjsPieComponent } from './../utils/charts/pie-chart/chartjs-pie.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { DashboardSectionComponent } from './dashboard-section/dashboard-section.component';

import { EchartsPieComponent } from '../utils/charts/pie-chart/echarts-pie.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { BarChartComponent } from '../utils/charts/bar-chart/bar-chart.component';
import { D3PieComponent } from '../utils/charts/pie-chart/d3-pie.component';
import { BarEchartComponent } from '../utils/charts/bar-chart/bar-echart.component';
import { ProgressSectionComponent } from './progress-section/progress-section.component';
import { UserActivitiesComponent } from './user-activities/user-activities.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    ChartjsLineComponent,
    ChartjsPieComponent,
    EchartsPieComponent,
    UserDetailsComponent,
    BarChartComponent,
    D3PieComponent,
    BarEchartComponent,
    DashboardSectionComponent,
    ProgressSectionComponent,
    UserActivitiesComponent,
  ],

  imports: [
    DashboardRoutingModule,
    NbMenuModule,
    ThemeModule,
    NbCardModule,
    NbActionsModule,
    NbListModule,
    NbDatepickerModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbInputModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbSelectModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
  ],

})
export class DashboardModule {
}
