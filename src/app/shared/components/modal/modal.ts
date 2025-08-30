import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal {
  @Input() title: any;
  @Input() showModal: any;
  @Output() closeModal = new EventEmitter<any>();

  close() {
    this.closeModal.emit(false);
  }

}
