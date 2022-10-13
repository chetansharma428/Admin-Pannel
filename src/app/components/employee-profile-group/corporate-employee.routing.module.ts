import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CorporateEmployeeComponent } from './corporate-employee.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CorporateEmployeeSectionComponent } from './corporate-employee-section/corporate-employee-section.component';
import { AddUserComponent } from './add-profile/add-user.component';

const routes: Routes = [
  {
    path: '',
    component: CorporateEmployeeComponent,
    children: [
      {
        path: '',
        component: CorporateEmployeeSectionComponent
      },
      {
        path: 'createProfile',
        component: AddUserComponent
      },

      {
        path: ':id',
        component: EditProfileComponent
      },

      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '' }
    ],
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CorporateEmployeeRoutingModule {}
