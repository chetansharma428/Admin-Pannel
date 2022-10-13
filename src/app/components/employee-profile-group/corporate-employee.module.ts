import { CorporateEmployeeRoutingModule } from './corporate-employee.routing.module';
import { CommonModule } from '@angular/common';
import { CorporateEmployeeComponent } from './corporate-employee.component';
import { NgModule } from "@angular/core";
import { NbActionsModule, NbAutocompleteModule, NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbTagModule } from '@nebular/theme';
import { CorporateEmployeeSectionComponent } from './corporate-employee-section/corporate-employee-section.component';
import { CorporateEmployeeListingComponent } from './corporate-employee-section/corporate-employee-listing/corporate-employee-listing.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-profile/add-user.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PermissionListComponent } from './corporate-employee-section/corporate-employee-listing/permission-list/permission-list.component';
import { ViewDetailComponent } from './corporate-employee-section/corporate-employee-listing/view-detail/view-detail.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    CorporateEmployeeComponent,
    CorporateEmployeeSectionComponent,
    CorporateEmployeeListingComponent,
    AddUserComponent,
    EditProfileComponent,
    PermissionListComponent,
    ViewDetailComponent

  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    Ng2SmartTableModule,
    NbDialogModule.forRoot(),
    NbRadioModule,
    NbActionsModule,
    ReactiveFormsModule,
    NbTagModule,
    NbSelectModule,
    NbAutocompleteModule,
    SharedModule,
    NbInputModule,
    NbSpinnerModule,
    CorporateEmployeeRoutingModule
  ]
})

export class CorporateEmployeeModule {}
