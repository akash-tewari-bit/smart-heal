import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SettingsService } from '../../loggedin-wrapper/settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  showSpinner = new BehaviorSubject<any>(false);
  showToast = new BehaviorSubject<any>(null);
  environment = environment;
  configurations: any;
  appointmentLimitReachedText = 'You’ve reached the appointment limit for your current plan.';
  upgradePlanText = 'Please upgrade or purchase a new plan to continue scheduling and taking appointments.';
  subscriptionExpiredText = 'Your subscription plan has expired.';
  renewPlanText = 'Please renew or upgrade your plan to continue scheduling and taking appointments.';

  constructor(public http: HttpClient, public settingsService: SettingsService) { }

  setSpinnerState(data: boolean) {
    return this.showSpinner.next(data);
  }

  showToastMessage(data: any) {
    return this.showToast.next(data);
  }

  transformObj(data: any) {
    for (var item in data) {
      if (data[item] && typeof data[item] == 'object') {
        this.transformObj(data[item])
      }
      else if (typeof data[item] != 'boolean' && !data[item]) {
        data[item] = null
      }
    }
    return data
  }

  search(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}dashboard/search?text=${query}`);
  }

  setConfigurations(data: any) {
    this.configurations = data;
  }

  convertTimeFormat(convertTo24HourFormat: boolean, time: string): string {
    if (convertTo24HourFormat) {
      // Convert from 12-hour AM/PM format to 24-hour format
      // Input: "01:00 AM" or "01:00 PM"
      // Output: "13:00:00"
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      
      let convertedHours = hours;
      if (period === 'AM' && hours === 12) {
        convertedHours = 0;
      } else if (period === 'PM' && hours !== 12) {
        convertedHours = hours + 12;
      }
      
      const hh = convertedHours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      return `${hh}:${mm}:00`;
    } else {
      // Convert from 24-hour format to 12-hour AM/PM format
      // Input: "13:00:00"
      // Output: "01:00 PM"
      const [hours, minutes] = time.split(':').map(Number);
      
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const hh = displayHours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      return `${hh}:${mm} ${period}`;
    }
  }
}
