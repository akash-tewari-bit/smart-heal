import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevelopersRoutingModule } from './developers-routing-module';
import { Developers } from './developers';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    Developers
  ],
  imports: [
    CommonModule,
    DevelopersRoutingModule,
    MatPaginatorModule
  ]
})
export class DevelopersModule { }
