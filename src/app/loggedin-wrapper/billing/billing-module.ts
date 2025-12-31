import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing-module';
import { Billing } from './billing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Filter } from './filter/filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';


@NgModule({
  declarations: [
    Billing,
    Filter
  ],
  imports: [
    CommonModule,
    BillingRoutingModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
  ]
})
export class BillingModule { }
