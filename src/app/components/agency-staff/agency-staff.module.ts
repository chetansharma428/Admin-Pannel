import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyStaffComponent } from './agency-staff/agency-staff.component';
import { SharedModule } from '../shared.module';
import { RouterModule } from '@angular/router';
import { AgencyStaffListComponent } from './agency-staff-list/agency-staff-list.component';
import { AgencyStaffRoutingModule } from './agency.routing.module';

import { NbSelectModule, NbAccordionModule, NbActionsModule, NbInputModule, NbButtonModule, NbIconModule, NbDialogModule, NbCardModule, NbCheckboxModule, NbToggleModule, NbTabsetModule, NbLayoutModule, NbTagModule, NbAutocompleteModule, NbSpinnerModule } from '@nebular/theme';
import { StaffListingComponent } from './agency-staff-list/staff-listing/staff-listing.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UpdateAgencyStaffComponent } from './update-agency-staff/update-agency-staff.component';
import { ViewDetailsComponent } from './agency-staff-list/staff-listing/view-details/view-details.component';
import { CreateAgencyStaffComponent } from './create-agency-staff/create-agency-staff.component';

@NgModule({
  declarations: [
    AgencyStaffComponent,
    AgencyStaffListComponent,
    StaffListingComponent,
    UpdateAgencyStaffComponent,
    ViewDetailsComponent,
    CreateAgencyStaffComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    AgencyStaffRoutingModule,
    Ng2SmartTableModule,
    NbSelectModule, NbAccordionModule, NbActionsModule, NbSpinnerModule, NbInputModule, NbButtonModule, NbIconModule, NbDialogModule, NbCardModule, NbCheckboxModule, NbToggleModule, NbTabsetModule, NbLayoutModule, NbTagModule, NbAutocompleteModule,FormsModule
  ]
})
export class AgencyStaffModule { }
