import { CorporateRoutingModule } from './corporate-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateComponent } from './corporate.component';
import { WalletLayoutComponent } from './wallet-layout/wallet-layout.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CorporateSectionComponent } from './corporate-section/corporate-section.component';
import { CorporateRegisterComponent } from './corporate-register/corporate-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewwalletComponent } from './corporate-section/corporate-listing/viewwallet/viewwallet.component';
import { NbSelectModule, NbAccordionModule, NbActionsModule, NbInputModule, NbButtonModule, NbIconModule, NbDialogModule, NbCardModule, NbCheckboxModule, NbToggleModule, NbTabsetModule, NbLayoutModule, NbTagModule, NbAutocompleteModule, NbSpinnerModule, NbDatepickerModule } from '@nebular/theme';
import { WalletSmartTableComponent } from './wallet-layout/wallet-smart-table/wallet-smart-table.component';
import { DataErrorDailogComponent } from './wallet-layout/data-error-dailog/data-error-dailog.component';
import { SucessDailogComponent } from './wallet-layout/sucess-dailog/sucess-dailog.component';
import { CorporatelistingComponent } from './corporate-section/corporate-listing/corporate-listing.component';
import { ToggleButtonComponent } from './corporate-section/corporate-listing/toggle-button/toggle-button.component';
import { CorporateProfileComponent } from './corporate-profile/corporate-profile.component';
import { SharedModule } from '../shared.module';
import { CreateWalletComponent } from './corporate-section/corporate-listing/create-wallet/create-wallet.component';
import { UpdateWalletComponent } from './wallet-layout/update-wallet/update-wallet.component';

@NgModule({
  declarations: [
    CorporateComponent,
    WalletLayoutComponent,
    WalletSmartTableComponent,
    CorporateComponent,
    CorporateSectionComponent,
    CorporateRegisterComponent,
    CorporatelistingComponent,
    ViewwalletComponent,
    DataErrorDailogComponent,
    SucessDailogComponent,
    ToggleButtonComponent,
    CorporateProfileComponent,
    CreateWalletComponent,
    UpdateWalletComponent
  ],
  imports: [
    CommonModule,
    CorporateRoutingModule,
    SharedModule,
    NbSelectModule,
    NbActionsModule,
    NbTabsetModule,
    NbLayoutModule,
    NbInputModule,
    FormsModule,
    NbSpinnerModule,
    NbToggleModule,
    Ng2SmartTableModule,
    NbIconModule,
    NbCheckboxModule,
    NbDialogModule.forRoot(),
    ReactiveFormsModule,
    NbButtonModule,
    NbCardModule,
    NbAccordionModule,
    NbTagModule,
    NbDatepickerModule,
    NbAutocompleteModule
  ],
})
export class CorporateModule { }
