import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing-module';
import { Subscription } from './subscription';
import { SharedModule } from '../../shared/shared-module';


@NgModule({
  declarations: [
    Subscription
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule
  ]
})
export class SubscriptionModule { }
