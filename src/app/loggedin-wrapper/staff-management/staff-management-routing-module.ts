import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffManagement } from './staff-management';
import { AddStaff } from './add-staff/add-staff';

const routes: Routes = [
  {
    path: '',
    component: StaffManagement
  },
  {
    path: 'add-staff',
    component: AddStaff
  },
  {
    path: 'edit/:id',
    component: AddStaff
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffManagementRoutingModule { }
