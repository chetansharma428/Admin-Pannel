import { PolicyComponent } from './policy.component';
import { PolicySectionComponent } from './policy-section/policy-section.component';
import { NgModule } from "@angular/core";
import { NbAccordionModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbSelectModule, NbSpinnerModule, NbTagModule, NbToggleModule } from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PolicyRoutingModule } from './policy.routing.module';
import { PolicySmartTableComponent } from './policy-section/policy-smart-table/policy-smart-table.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CreatePolicyComponent } from './create-policy/create-policy.component';
import { CommonModule } from '@angular/common';
import { UpdatePolicyComponent } from './update-policy/update-policy.component';
import { ViewDetailsComponent } from './policy-section/policy-smart-table/view-details/view-details.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    PolicyComponent,
    PolicySectionComponent,
    PolicySmartTableComponent,
    CreatePolicyComponent,
    UpdatePolicyComponent,
    ViewDetailsComponent,
  ],
  imports: [
    ThemeModule,
    CommonModule,
    FormsModule,
    NbCardModule,
    ReactiveFormsModule,
    PolicyRoutingModule,
    NbLayoutModule,
    NbIconModule,
    NbButtonModule,
    Ng2SmartTableModule,
    NbButtonGroupModule,
    NbTagModule,
    NbSpinnerModule,
    SharedModule,
    NbInputModule,
    NbSelectModule,
    NbAccordionModule,
    NbToggleModule,
    NbFormFieldModule
  ],
})

export class PolicyModule {}
