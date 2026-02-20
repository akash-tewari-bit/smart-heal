import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing-module';
import { Appointments } from './appointments';
import { ScheduleAppointment } from './schedule-appointment/schedule-appointment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentAction } from './appointment-action/appointment-action';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { QRCodeComponent } from 'angularx-qrcode';
import { SharedModule } from '../../shared/shared-module';
import { Filter } from './filter/filter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    Appointments,
    ScheduleAppointment,
    AppointmentAction,
    Filter,
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    QRCodeComponent,
    SharedModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  providers: [DatePipe]
})
export class AppointmentsModule { }
