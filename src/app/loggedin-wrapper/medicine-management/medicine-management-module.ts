import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicineManagementRoutingModule } from './medicine-management-routing-module';
import { MedicineManagement } from './medicine-management';
import { AddMedicine } from './add-medicine/add-medicine';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    MedicineManagement,
    AddMedicine
  ],
  imports: [
    CommonModule,
    MedicineManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSelectModule
  ]
})
export class MedicineManagementModule { }
