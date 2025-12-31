import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing-module';
import { General } from './general/general';
import { Settings } from './settings';
import { UPI } from './upi/upi';
import { Subscription } from './subscription/subscription';
import { SharedModule } from '../../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    General,
    Settings,
    UPI,
    Subscription
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
