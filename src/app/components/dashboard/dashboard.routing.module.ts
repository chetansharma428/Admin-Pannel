import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardSectionComponent } from './dashboard-section/dashboard-section.component';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: '', component: LayoutComponent}
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
