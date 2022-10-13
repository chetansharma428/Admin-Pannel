import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NbAccordionModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbToggleModule } from "@nebular/theme";
import { SharedModule } from "../shared.module";
import { RevenueSectionComponent } from "./revenue-section/revenue-section.component";
import { RevenueComponent } from "./revenue/revenue.component";
import { RevenueConfigRoutingModule } from "./revenueConfig.routing,module";
import { RevenueTableComponent } from './revenue-section/revenue-table/revenue-table.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ViewDetailsComponent } from './revenue-section/revenue-table/view-details/view-details.component';
import { AddRevenueRuleSetComponent } from "./add-revenue-rule-set/add-revenue-rule-set.component";
import { UpdateRevenueRuleSetComponent } from './update-revenue-rule-set/update-revenue-rule-set.component';

@NgModule({
  declarations: [
    RevenueComponent,
    RevenueSectionComponent,
    RevenueTableComponent,
    ViewDetailsComponent,
    AddRevenueRuleSetComponent,
    UpdateRevenueRuleSetComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    SharedModule,
    RevenueConfigRoutingModule,
    NbIconModule,
    ReactiveFormsModule,
    NbSpinnerModule,
    NbToggleModule,
    Ng2SmartTableModule,
    NbAutocompleteModule,
    FormsModule,
    NbDatepickerModule,
    NbButtonModule,
    NbSelectModule,
    NbInputModule,
    NbRadioModule,
    NbAccordionModule,
  ]
})

export class RevenueConfigModule {}
