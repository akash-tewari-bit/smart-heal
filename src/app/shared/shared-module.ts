import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { RouterModule } from '@angular/router';
import { Modal } from './components/modal/modal';


@NgModule({
  declarations: [
    Sidebar,
    Header,
    Modal
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    Sidebar,
    Header,
    Modal
  ]
})
export class SharedModule { }
