import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Appointments } from './appointments';
import { ScheduleAppointment } from './schedule-appointment/schedule-appointment';
import { AppointmentAction } from './appointment-action/appointment-action';

const routes: Routes = [
  {
    path: '',
    component: Appointments
  },
  {
    path: 'schedule',
    component: ScheduleAppointment
  },
  {
    path: ':id',
    component: AppointmentAction
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
