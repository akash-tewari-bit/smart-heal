import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Developers } from './developers';
import { EditDeveloper } from './edit-developer/edit-developer';

const routes: Routes = [
  {
    path: '',
    component: Developers
  },
  {
    path: 'view-edit/:id',
    component: EditDeveloper
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevelopersRoutingModule { }
