import { Component } from '@angular/core';
import { UtilityService } from '../../shared/services/utility.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  configurations: any = '';

  constructor(public utilService: UtilityService, public settingsService: SettingsService) {}

  ngOnInit() {
    setTimeout(() => { 
      this.upiConfiguration();
    });
  }

  upiConfiguration() {
  this.utilService.setSpinnerState(true);
    this.settingsService.getConfiguration().subscribe(
      (res: any) => {
        if(res?.success) {
          this.utilService.setSpinnerState(false);
          this.configurations = res?.data;
        }
        else {
          this.utilService.setSpinnerState(false);
        }
      },
      (err: any) => {
        this.utilService.setSpinnerState(false);
      }
    );
  }

}
