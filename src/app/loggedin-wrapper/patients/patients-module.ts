import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing-module';
import { Patients } from './patients';
import { Filter } from './filter/filter';
import { PatientDetails } from './patient-details/patient-details';


@NgModule({
  declarations: [
    Patients,
    Filter,
    PatientDetails
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule
  ]
})
export class PatientsModule { }
