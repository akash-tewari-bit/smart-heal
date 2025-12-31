import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  isMobile = window.innerWidth < 768;
  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  configurations: any = JSON.parse(localStorage.getItem('configurations')!);

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobile = window.innerWidth < 768;  // Consider 768px as the breakpoint for mobile
  }

  ngOnInit() {
    this.onResize();
  }
  
  ngAfterContentChecked() {
    this.configurations= JSON.parse(localStorage.getItem('configurations')!);
  }

}
