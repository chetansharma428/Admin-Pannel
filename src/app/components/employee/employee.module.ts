import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeSectionComponent } from './employee-section/employee-section.component';
import { EmployeeComponent } from './employee.component';
import { EmployeeListingComponent } from './employee-section/employee-listing/employee-listing.component';

import { NbCardModule, NbIconModule, NbToggleModule, NbDialogModule, NbSelectModule, NbInputModule, NbDatepickerModule, NbButtonModule, NbAutocompleteModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { ToggleButtonComponent } from './employee-section/employee-listing/toggle-button/toggle-button.component';
import { EmployeeRegisterComponent } from './employee-register/employee-register.component';
import { ViewDetailsComponent } from './employee-section/employee-listing/view-details/view-details.component';
import { SharedModule } from '../shared.module';


@NgModule({
  declarations: [
    EmployeeSectionComponent,
    EmployeeComponent,
    EmployeeListingComponent,
    EmployeeProfileComponent,
    ToggleButtonComponent,
    EmployeeRegisterComponent,
    ViewDetailsComponent,
    

  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    NbCardModule,
    Ng2SmartTableModule,
    SharedModule,
    NbIconModule,
    NbToggleModule,
    NbSpinnerModule,
    NbDialogModule.forRoot(),
    NbSelectModule,
    NbInputModule,
    NbDatepickerModule.forRoot(),
    NbButtonModule,
    ReactiveFormsModule,
    NbAutocompleteModule,
    FormsModule
  ],
})
export class EmployeeModule { }
