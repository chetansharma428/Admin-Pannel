import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { BranchListingComponent } from './branch-section/branch-listing/branch-listing.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BranchSectionComponent } from './branch-section/branch-section.component';
import { NbCardModule, NbIconModule, NbButtonModule, NbInputModule, NbAccordionModule, NbSpinnerModule, NbCheckboxModule } from '@nebular/theme';
import { SharedModule } from '../shared.module';
import { BranchProfileComponent } from './branch-profile/branch-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchRegisterComponent } from './branch-register/branch-register.component';
@NgModule({
  declarations: [
    BranchComponent,
    BranchListingComponent,
    BranchSectionComponent,
    BranchProfileComponent,
    BranchRegisterComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbCheckboxModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NbInputModule,
    NbAccordionModule,
    NbSpinnerModule,
  ]
})
export class BranchModule { }
