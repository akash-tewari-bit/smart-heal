import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevelopersRoutingModule } from './developers-routing-module';
import { Developers } from './developers';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditDeveloper } from './edit-developer/edit-developer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    Developers,
    EditDeveloper
  ],
  imports: [
    CommonModule,
    DevelopersRoutingModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatSelectModule
  ]
})
export class DevelopersModule { }
