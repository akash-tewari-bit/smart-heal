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
  @Input() modalFullWidth = false;
  @Input() buttonText: any;
  @Output() closeModal = new EventEmitter<any>();
  @Output() success = new EventEmitter<any>();
  @Input() disablePrimaryButton: any = false;

  close() {
    this.closeModal.emit(false);
  }

  successEvent() {
    this.success.emit(true)
  }

}
