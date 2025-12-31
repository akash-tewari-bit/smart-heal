import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Notification } from './notification';

const routes: Routes = [
  {
    path: '',
    component: Notification
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
