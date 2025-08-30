import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Patients } from './patients';
import { PatientDetails } from './patient-details/patient-details';

const routes: Routes = [
  {
    path: '',
    component: Patients
  },
  {
    path: ':id',
    component: PatientDetails
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
