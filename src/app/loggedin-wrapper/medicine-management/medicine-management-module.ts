import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicineManagementRoutingModule } from './medicine-management-routing-module';
import { MedicineManagement } from './medicine-management';
import { AddMedicine } from './add-medicine/add-medicine';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';


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
    MatPaginatorModule
  ]
})
export class MedicineManagementModule { }
