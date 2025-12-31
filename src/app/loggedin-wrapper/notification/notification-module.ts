import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing-module';
import { Notification } from './notification';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    Notification
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MatPaginatorModule
  ]
})
export class NotificationModule { }
