import { AgencyUserProfileComponent } from './agency-user-profile.component';
import { NgModule } from '@angular/core';
import { AgencyUserProfileRoutingModule } from './agency-user-profile-routing.module';
import { CommonModule } from '@angular/common';
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbTagModule } from '@nebular/theme';
import { AgencyUserProfileSectionComponent } from './agency-user-profile-section/agency-user-profile-section.component';
import { AgencyUserListingComponent } from './agency-user-profile-section/agency-user-listing/agency-user-listing.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CreateAgencyUserProfileComponent } from './create-agency-user-profile/create-agency-user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateAgencyUserProfileComponent } from './update-agency-user-profile/update-agency-user-profile.component';
import { PermissionListComponent } from './agency-user-profile-section/agency-user-listing/permission-list/permission-list.component';
import { ViewDetailComponent } from './agency-user-profile-section/agency-user-listing/view-detail/view-detail.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    AgencyUserProfileRoutingModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbTagModule,
    NbSelectModule,
    NbInputModule,
    NbAutocompleteModule,
    NbSpinnerModule,
    SharedModule
  ],
  declarations: [
    AgencyUserProfileComponent,
    AgencyUserProfileSectionComponent,
    AgencyUserListingComponent,
    AgencyUserListingComponent,
    CreateAgencyUserProfileComponent,
    UpdateAgencyUserProfileComponent,
    PermissionListComponent,
    ViewDetailComponent,
  ]
})

export class AgencyUserProfileModule {}
