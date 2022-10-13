import { WalletLayoutComponent } from './wallet-layout/wallet-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CorporateComponent } from './corporate.component';
import { CorporateRegisterComponent } from './corporate-register/corporate-register.component';
import { CorporateSectionComponent } from './corporate-section/corporate-section.component';
import { CorporateProfileComponent } from './corporate-profile/corporate-profile.component';

const routes: Routes = [
  {
    path: '',
    component: CorporateComponent,
    children: [
      {
        path: 'activate',
        component: CorporateProfileComponent
      },
      {
        path: 'list',
        component: CorporateSectionComponent
      },
      {
        path: 'register',
        component: CorporateRegisterComponent
      },
      {
        path: ':corporateId/profile',
        component: CorporateProfileComponent
      },
      {
        path: ':agencyId/corporateId/:corporateId/walletId/:walletId',
        component: WalletLayoutComponent
      },

      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ],
  }
];

//
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporateRoutingModule { }
