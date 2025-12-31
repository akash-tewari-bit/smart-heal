import { Component, ElementRef, Renderer2, signal } from '@angular/core';
import { UtilityService } from './shared/services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('smart-heal-web');
  showSpinner: boolean = false;
  constructor(public utilService: UtilityService) {
    this.utilService.showSpinner.subscribe((e: any) => {
      this.showSpinner = e;
    })
  }
  
}
