import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

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
  notificationList = [
    { title: 'New appointment created', message: 'Dated Nov 20, 2025 - 12:15 PM' },
    { title: 'Leave applied', message: 'Dated Nov 20, 2025 - 12:15 PM' },
    { title: 'Payment received', message: 'Dated Nov 20, 2025 - 12:15 PM' },
  ]

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobile = window.innerWidth < 768;  // Consider 768px as the breakpoint for mobile
  }

  constructor(public router: Router) {}

  ngOnInit() {
    this.onResize();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}
