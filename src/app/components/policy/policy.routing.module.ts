import { UpdatePolicyComponent } from './update-policy/update-policy.component';
import { PolicySectionComponent } from './policy-section/policy-section.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyComponent } from './policy.component';
import { CreatePolicyComponent } from './create-policy/create-policy.component';

const routes: Routes = [
  {
    path: '',
    component: PolicyComponent,
    children: [
      {
        path: '',
        component: PolicySectionComponent
      },
      {
        path: 'add_Policy',
        component: CreatePolicyComponent
      },
      {
        path: 'update_Policy/:option/:id',
        component: UpdatePolicyComponent
      },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: '' }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PolicyRoutingModule {}
