import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicineManagement } from './medicine-management';
import { AddMedicine } from './add-medicine/add-medicine';

const routes: Routes = [
  {
    path: '',
    component: MedicineManagement
  },
  {
    path: 'add-medicine',
    component: AddMedicine
  },
  {
    path: 'edit-medicine/:id',
    component: AddMedicine
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineManagementRoutingModule { }
