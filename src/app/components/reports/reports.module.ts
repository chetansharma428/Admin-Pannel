import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportComponent } from './report/report.component';
import { NbSelectModule,NbCardModule, NbDatepickerModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NbSelectModule,
    NbCardModule,
    NbDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    NbButtonModule,
    NbInputModule
  ]
})
export class ReportsModule { }
