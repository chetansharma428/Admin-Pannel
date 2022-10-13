import { UpdateAgencyUserProfileComponent } from './update-agency-user-profile/update-agency-user-profile.component';
import { CreateAgencyUserProfileComponent } from './create-agency-user-profile/create-agency-user-profile.component';
import { AgencyUserProfileSectionComponent } from './agency-user-profile-section/agency-user-profile-section.component';
import { AgencyUserProfileComponent } from './agency-user-profile.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: AgencyUserProfileComponent,
    children: [
      {
        path: 'list',
        component: AgencyUserProfileSectionComponent
      },
      {
        path: 'createUserProfile',
        component: CreateAgencyUserProfileComponent
      },
      {
        path: 'updateProfile/:id',
        component: UpdateAgencyUserProfileComponent
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AgencyUserProfileRoutingModule {}
