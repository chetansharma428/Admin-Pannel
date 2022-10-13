import { NgModule } from '@angular/core';
import { NbMenuModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbSearchModule, NbFormFieldModule, NbCardModule, NbActionsModule, NbTabsetModule, NbSelectModule, NbDialogModule, NbIconModule, NbLayoutModule, NbTagModule, NbAutocompleteModule, NbSpinnerModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { GroupsRoutingModule } from './groups.routing.module';


import { GroupsComponent } from './groups.component';
import { GroupsSectionComponent } from './groups-section/groups-section.component';

import { DragAndDropComponent } from './drag-drop/drag-and-drop/drag-and-drop.component';
import { DndDirective } from './drag-drop/drag-drop-directive/dnd.directive';

import { SmartTableComponent } from './groups-section/smart-table/smart-table.component';
import { BulkUploadModalComponent } from './bulk-upload-modal/bulk-upload-modal.component';
import { ViewpolicyComponent } from './groups-section/smart-table/viewpolicy/viewpolicy.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { PolicyNameComponent } from './groups-section/smart-table/policy-name/policy-name.component';
import { PolicyTypeComponent } from './groups-section/smart-table/policy-type/policy-type.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    NbMenuModule,
    ThemeModule,
    NbCardModule,
    NbActionsModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    GroupsRoutingModule,
    NbDialogModule.forRoot(),
    NbFormFieldModule,
    NbSearchModule,
    NbCheckboxModule,
    NbInputModule,
    NbButtonModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2SmartTableModule,
    NbLayoutModule,
    NbTagModule,
    NbSpinnerModule,
    NbAutocompleteModule,
  ],
  declarations: [
    GroupsComponent,
    GroupsSectionComponent,
    CreateGroupComponent,
    DragAndDropComponent,
    DndDirective,
    SmartTableComponent,
    BulkUploadModalComponent,
    ViewpolicyComponent,
    EditGroupComponent,
    PolicyNameComponent,
    PolicyTypeComponent,
  ],
})
export class GroupsModule {
}
