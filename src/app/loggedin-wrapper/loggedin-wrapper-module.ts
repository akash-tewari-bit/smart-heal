import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LoggedinWrapperRoutingModule } from './loggedin-wrapper-routing-module';
import { LoggedinWrapper } from './loggedin-wrapper';
import { Dashboard } from './dashboard/dashboard';
import { SharedModule } from '../shared/shared-module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoggedinWrapper,
    Dashboard
  ],
  imports: [
    CommonModule,
    LoggedinWrapperRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe
  ]
})
export class LoggedinWrapperModule { }
