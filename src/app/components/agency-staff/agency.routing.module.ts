
import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyStaffListComponent } from './agency-staff-list/agency-staff-list.component';
import { AgencyStaffComponent } from './agency-staff/agency-staff.component';
import { CreateAgencyStaffComponent } from './create-agency-staff/create-agency-staff.component';
import { UpdateAgencyStaffComponent } from './update-agency-staff/update-agency-staff.component';

const routes: Routes = [
  {
    path: '',
    component: AgencyStaffComponent,
    children: [
      {
        path: 'list',
        component: AgencyStaffListComponent
      },
      {
        path: 'add',
        component: CreateAgencyStaffComponent
      },
      {
        path: 'update-Details/:emailId',
        component: UpdateAgencyStaffComponent
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

//
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyStaffRoutingModule { }
