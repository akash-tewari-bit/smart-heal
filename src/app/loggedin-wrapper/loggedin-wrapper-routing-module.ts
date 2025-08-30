import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedinWrapper } from './loggedin-wrapper';
import { Dashboard } from './dashboard/dashboard';
import { Patients } from './patients/patients';

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
        path: 'patients',
        loadChildren: () => import('./patients/patients-module').then(m => m.PatientsModule)
      },
      {
        path: 'appointments',
        loadChildren: () => import('./appointments/appointments-module').then(m => m.AppointmentsModule)
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
