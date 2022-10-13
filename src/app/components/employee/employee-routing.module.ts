import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeSectionComponent } from './employee-section/employee-section.component';
import { EmployeeComponent } from './employee.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { EmployeeRegisterComponent } from './employee-register/employee-register.component';

const routes: Routes = [{
  path: '',
  component: EmployeeComponent,
  children: [
    {
      path: 'list',
      component: EmployeeSectionComponent
    },
    {
      path: ':emailId/profile',
      component: EmployeeProfileComponent
    },
    {
      path: 'register',
      component: EmployeeRegisterComponent
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
