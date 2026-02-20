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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';


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
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule
  ]
})
export class PatientsModule { }
