import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTagModule } from "@nebular/theme";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { SharedModule } from "../shared.module";
import { CorporateCodeSectionComponent } from "./corporate-code-section/corporate-code-section.component";
import { SmartTableComponent } from "./corporate-code-section/smart-table/smart-table.component";
import { CorporateCodeRoutingModule } from "./corporate-code.routing.module";
import { CorporateCodeComponent } from "./corporate-code/corporate-code.component";
import { ViewDetailsComponent } from './corporate-code-section/smart-table/view-details/view-details.component';
import { AddCorporatecodeComponent } from './add-corporatecode/add-corporatecode.component';
import { UpdateCorporateCodeComponent } from './update-corporate-code/update-corporate-code.component';

@NgModule({
  declarations: [
    CorporateCodeComponent,
    CorporateCodeSectionComponent,
    SmartTableComponent,
    ViewDetailsComponent,
    AddCorporatecodeComponent,
    UpdateCorporateCodeComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NbAutocompleteModule,
    CorporateCodeRoutingModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbTagModule,
    NbIconModule,
    NbSpinnerModule,
    Ng2SmartTableModule,
  ]
})

export class CorporateCodeModule {}
