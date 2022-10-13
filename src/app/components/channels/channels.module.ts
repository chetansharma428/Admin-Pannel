import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTagModule, NbThemeModule } from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { SharedModule } from "../shared.module";
import { ChannelTableComponent } from "./channels-section/channel-table/channel-table.component";
import { ProvidersListComponent } from "./channels-section/channel-table/providers-list/providers-list.component";
import { ChannelsSectionComponent } from "./channels-section/channels-section.component";
import { ChannelsRoutingModule } from "./channels.routing.module";
import { ChannelsComponent } from "./channels/channels.component";
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { ViewDetailsComponent } from './channels-section/channel-table/view-details/view-details.component';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    ChannelsComponent,
    ChannelsSectionComponent,
    ChannelTableComponent,
    ProvidersListComponent,
    EditChannelComponent,
    ViewDetailsComponent,
    AddChannelComponent
  ],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    SharedModule,
    NbAutocompleteModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbTagModule,
    NbIconModule,
    NbSpinnerModule,
    Ng2SmartTableModule,
  ]
})

export class ChannelsModule {}
