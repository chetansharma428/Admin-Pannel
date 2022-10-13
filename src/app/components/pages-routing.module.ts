import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { LoginGuard } from '../lib/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [{
      path: 'auth',
      canActivate: [LoginGuard],
      loadChildren: () => import('./authentication/auth.module').then(m => m.NgxAuthModule),
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    },
    {
      path: ':id/configuration',
      loadChildren: () => import('./configurationPage/configuration.module').then(m => m.ConfigurationModule),
    },
    {
      path: 'agencies/:id/user-profile',
      loadChildren: () => import('./agency-user-profile/agency-user-profile.module').then(m => m.AgencyUserProfileModule),
    },
    {
      path: 'agency/:id/staff',
      loadChildren: () => import('./agency-staff/agency-staff.module').then(m => m.AgencyStaffModule),
    },
    {
      path: 'corporate',
      loadChildren: () => import('./corporate/corporate.module').then(m => m.CorporateModule),
    },
    {
      path: ':id/corporate',
      loadChildren: () => import('./corporate/corporate.module').then(m => m.CorporateModule),
    },
    {
      path: ':id/corporate/:corpId/employee',
      loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
    },
    {
      path: ':id/corporate/:corpId/employee-profile',
      loadChildren: () => import('./employee-profile-group/corporate-employee.module').then(m => m.CorporateEmployeeModule),
    },
    {
      path: ':id/corporate/:corpId/policy',
      loadChildren: () => import('./policy/policy.module').then(m => m.PolicyModule),
    },
    {
      path: ':id/corporate/:corpId/groups',
      loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule),
    },
    {
      path: ':id/providers',
      loadChildren: () => import('./providerConfig/provider-config.module').then(m => m.ProviderConfigModule),
    },
    {
      path: ':id/channels',
      loadChildren: () => import('./channels/channels.module').then(m => m.ChannelsModule),
    },
    {
      path: ':id/revenue',
      loadChildren: () => import('./revenueConfig/revenueConfig.module').then(m => m.RevenueConfigModule),
    },
    {
      path: ':id/corporate-code',
      loadChildren: () => import('./corporateCode/corporate-code.module').then(m => m.CorporateCodeModule),
    },
    {
      path: ':id/passThrough',
      loadChildren: () => import('./passthroughConfig/passthrough.module').then(m => m.PassThroughModule),
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
    },
    {
      path: ':id/branch',
      loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule),
    },
    {
      path: 'booking',
      loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
    },
    {
      path: 'report',
      loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    }
    ]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
