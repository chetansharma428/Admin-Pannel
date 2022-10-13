import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchProfileComponent } from './branch-profile/branch-profile.component';
import { BranchRegisterComponent } from './branch-register/branch-register.component';
import { BranchSectionComponent } from './branch-section/branch-section.component';
import { BranchComponent } from './branch.component';

const routes: Routes = [{
  path: '',
  component: BranchComponent,
  children: [
    {
      path: 'list',
      component: BranchSectionComponent,
    },
    {
      path: ':branchId/profile',
      component: BranchProfileComponent
    },
    {
      path: 'register',
      component: BranchRegisterComponent
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
