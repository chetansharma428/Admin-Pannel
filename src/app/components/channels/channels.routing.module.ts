import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { ChannelsSectionComponent } from './channels-section/channels-section.component';
import { ChannelsComponent } from './channels/channels.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';

const routes: Routes = [{
  path: '',
  component: ChannelsComponent,
  children: [
    {
      path: 'list',
      component: ChannelsSectionComponent,
    },
    {
      path: 'create-channel',
      component: AddChannelComponent,
    },
    {
      path: 'update-channels/:ChannelId',
      component: EditChannelComponent,
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelsRoutingModule { }
