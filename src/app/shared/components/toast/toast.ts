import { Component, ElementRef, ViewChild } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
  @ViewChild('liveToast') toastElement!: ElementRef;
  toast: any;
  data: any;

  constructor(public utilService: UtilityService) {
    this.utilService.showToast.subscribe((res: any) => {
      if(res) {
        this.data = res
        this.showToast();
      }
    })
  }

  ngAfterViewInit(): void {
    this.toast = new bootstrap.Toast(this.toastElement.nativeElement, {
      autohide: true,
      delay: 3000
    });
  }

  showToast() {
    this.toast.show();
  }
}
