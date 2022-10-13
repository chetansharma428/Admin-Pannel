import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule } from "@nebular/theme";
import { SharedModule } from "../shared.module";
import { ProviderConfigSectionComponent } from "./provider-config-section/provider-config-section.component";
import { ProviderConfigRoutingModule } from "./provider-config.routing.module";
import { ProviderConfigComponent } from "./provider-config/provider-config.component";
import { ProvidersTableComponent } from './provider-config-section/providers-table/providers-table.component';
import { Ng2SmartTableModule } from "ng2-smart-table";
import { AddProvidersComponent } from './add-providers/add-providers.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ViewDetailsComponent } from './provider-config-section/providers-table/view-details/view-details.component';
import { EditProvidersComponent } from './edit-providers/edit-providers.component';

@NgModule({
  declarations: [
    ProviderConfigComponent,
    ProviderConfigSectionComponent,
    ProvidersTableComponent,
    AddProvidersComponent,
    ViewDetailsComponent,
    EditProvidersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProviderConfigRoutingModule,
    NbFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    NbButtonModule,
    NbSelectModule,
    NbInputModule,
    NbCardModule,
    NbIconModule,
    NbSpinnerModule,
    Ng2SmartTableModule,
    NbAutocompleteModule
  ]
})

export class ProviderConfigModule {}
