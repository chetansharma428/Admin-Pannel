import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbCardModule, NbAutocompleteModule, NbSelectModule, NbInputModule, NbButtonModule, NbTagModule, NbIconModule, NbSpinnerModule } from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { SharedModule } from "../shared.module";
import { PassthroughSectionComponent } from "./passthrough-section/passthrough-section.component";
import { PassThroughtRoutingModule } from "./passthrough.routing.module";
import { PassthroughComponent } from "./passthrough/passthrough.component";
import { SmartTableComponent } from './passthrough-section/smart-table/smart-table.component';
import { AirlineComponent } from './passthrough-section/smart-table/airline/airline.component';
import { AddPassthroughComponent } from './add-passthrough/add-passthrough.component';
import { ViewDetailsComponent } from './passthrough-section/smart-table/view-details/view-details.component';
import { UpdatePassconfigComponent } from './update-passconfig/update-passconfig.component';

@NgModule({
  declarations: [
    PassthroughComponent,
    PassthroughSectionComponent,
    SmartTableComponent,
    AirlineComponent,
    AddPassthroughComponent,
    ViewDetailsComponent,
    UpdatePassconfigComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NbAutocompleteModule,
    PassThroughtRoutingModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbTagModule,
    NbIconModule,
    NbSpinnerModule,
    Ng2SmartTableModule,
  ]
})

export class PassThroughModule {}
