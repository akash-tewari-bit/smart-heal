import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Developers } from './developers';

const routes: Routes = [
  {
    path: '',
    component: Developers
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevelopersRoutingModule { }
