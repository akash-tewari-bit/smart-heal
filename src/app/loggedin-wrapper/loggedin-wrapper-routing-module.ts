import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedinWrapper } from './loggedin-wrapper';
import { Dashboard } from './dashboard/dashboard';
import { Patients } from './patients/patients';
import { Settings } from './settings/settings';
import { adminGuard } from '../shared/guards/admin-guard';
import { ownerGuard } from '../shared/guards/owner-guard';
import { subscriptionGuard } from '../shared/guards/subscription-guard';

const routes: Routes = [
  {
    path: '',
    component: LoggedinWrapper,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings-module').then(m => m.SettingsModule)
      },
      {
        path: 'patients',
        canActivate: [subscriptionGuard],
        loadChildren: () => import('./patients/patients-module').then(m => m.PatientsModule)
      },
      {
        path: 'appointments',
        canActivate: [subscriptionGuard],
        loadChildren: () => import('./appointments/appointments-module').then(m => m.AppointmentsModule)
      },
      {
        path: 'notifications',
        canActivate: [subscriptionGuard],
        loadChildren: () => import('./notification/notification-module').then(m => m.NotificationModule)
      },
      {
        path: 'billing',
        canActivate: [subscriptionGuard],
        loadChildren: () => import('./billing/billing-module').then(m => m.BillingModule)
      },
      {
        path: 'subscriptions',
        canActivate: [adminGuard],
        loadChildren: () => import('./subscription/subscription-module').then(m => m.SubscriptionModule)
      },
      {
        path: 'staff-management',
        canActivate: [subscriptionGuard, adminGuard],
        loadChildren: () => import('./staff-management/staff-management-module').then(m => m.StaffManagementModule)
      },
      {
        path: 'developers',
        canActivate: [subscriptionGuard, ownerGuard],
        loadChildren: () => import('./developers/developers-module').then(m => m.DevelopersModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoggedinWrapperRoutingModule { }
