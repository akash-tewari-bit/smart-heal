import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggedinWrapperRoutingModule } from './loggedin-wrapper-routing-module';
import { LoggedinWrapper } from './loggedin-wrapper';
import { Dashboard } from './dashboard/dashboard';
import { SharedModule } from '../shared/shared-module';


@NgModule({
  declarations: [
    LoggedinWrapper,
    Dashboard
  ],
  imports: [
    CommonModule,
    LoggedinWrapperRoutingModule,
    SharedModule
  ]
})
export class LoggedinWrapperModule { }
