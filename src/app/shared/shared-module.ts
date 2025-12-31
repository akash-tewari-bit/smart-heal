import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { RouterModule } from '@angular/router';
import { Modal } from './components/modal/modal';
import { BootstrapTooltip } from './directives/bootstrap-tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Sidebar,
    Header,
    Modal,
    BootstrapTooltip
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    Sidebar,
    Header,
    Modal,
    BootstrapTooltip
  ]
})
export class SharedModule { }
