import { EditGroupComponent } from './edit-group/edit-group.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { GroupsComponent } from './groups.component';
import { GroupsSectionComponent } from './groups-section/groups-section.component';


const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    children: [
      {
        path: '',
        component: GroupsSectionComponent
      },
      {
        path: 'createGroup',
        component: CreateGroupComponent
      },
      {
        path: ':id',
        component: EditGroupComponent
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
export class GroupsRoutingModule {
}
