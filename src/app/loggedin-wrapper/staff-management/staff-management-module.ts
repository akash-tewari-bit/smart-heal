import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffManagementRoutingModule } from './staff-management-routing-module';
import { StaffManagement } from './staff-management';
import { StaffList } from './staff-list/staff-list';
import { AddStaff } from './add-staff/add-staff';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StaffManagement,
    StaffList,
    AddStaff
  ],
  imports: [
    CommonModule,
    StaffManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StaffManagementModule { }
