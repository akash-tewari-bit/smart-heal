import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  notificationCount: number = 8;
  isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobile = window.innerWidth < 768;  // Consider 768px as the breakpoint for mobile
  }

  ngOnInit() {
    this.onResize();
  }

}
