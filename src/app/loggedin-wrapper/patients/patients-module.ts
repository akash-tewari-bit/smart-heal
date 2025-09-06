import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing-module';
import { Patients } from './patients';
import { Filter } from './filter/filter';
import { PatientDetails } from './patient-details/patient-details';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal } from '../../shared/components/modal/modal';
import { SharedModule } from '../../shared/shared-module';


@NgModule({
  declarations: [
    Patients,
    Filter,
    PatientDetails
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PatientsRoutingModule,
    MatPaginatorModule,
    SharedModule
  ]
})
export class PatientsModule { }
