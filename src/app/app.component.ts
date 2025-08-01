import { Component } from '@angular/core';
import { UtilityService } from './shared/services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  showSpinner = false;
  constructor(public utilService: UtilityService) {
    this.utilService.showSpinner.subscribe((e: any) => {
      this.showSpinner = e;
    })
  }
}
