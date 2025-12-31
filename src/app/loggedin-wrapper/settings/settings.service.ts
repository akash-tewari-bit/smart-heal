import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  environment = environment

  constructor(public http: HttpClient) {}

  updateGeneralSettings(payload: any) {
    const url = `${environment.baseUrl}settings/general`
    return this.http.post<any>(url, payload);
  }

  updateUPISettings(payload: any) {
    const url = `${environment.baseUrl}settings/upi`
    return this.http.post<any>(url, payload);
  }

  getConfiguration() {
    const url = `${environment.baseUrl}settings/configurations`
    return this.http.get<any>(url);
  }

  getPlans() {
    const url = `${environment.baseUrl}plans`
    return this.http.get<any>(url);
  }

  subscribe(payload: any) {
    const url = `${environment.baseUrl}subscriptions/send_subscription_details_on_mail`
    return this.http.post<any>(url, payload);
  }

  getBillingHistory() {
    const url = `${environment.baseUrl}subscriptions/get_subscription_billing`
    return this.http.get<any>(url);
  }
  
}
