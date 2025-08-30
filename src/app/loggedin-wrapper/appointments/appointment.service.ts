import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  environment = environment;

  constructor(public http: HttpClient) {}

  schduleAppointment(payload: any) {
    const url = `${environment.baseUrl}appointments/create_appointment`
    return this.http.post<any>(url, payload);
  }

  getAppointmentsList() {
    const url = `${environment.baseUrl}appointments`
    return this.http.get<any>(url);
  }

  submitAppointment(payload: any) {
    const url = `${environment.baseUrl}visits/add_visits`
    return this.http.post<any>(url, payload);
  }
  
}
