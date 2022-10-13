import { NgModule } from '@angular/core';
import { NbCardModule, NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ConfirmDialogComponent } from './utils/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from './utils/dialogs/success-dialog/success-dialog.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule    
  ],  
  declarations: [
    PagesComponent,
    ConfirmDialogComponent,
    SuccessDialogComponent
  ],
})
export class PagesModule {
}

