import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  environment = environment;

  constructor(public http: HttpClient) {}

  getPatientsList(config: any, filter?: any) {
    let queryString = '';
    if (config?.page) {
      queryString += `?page=${config?.page}`;
    }
    if (config?.pageSize) {
      queryString += `&page_size=${config?.pageSize}`;
    }
    if (filter) {
      if (filter?.text) {
        queryString += `&text=${filter?.text}`;
      }
      if (filter?.month) {
        queryString += `&month=${filter?.month}`;
      }
      if (filter?.age) {
        queryString += `&age=${filter?.age}`;
      }
    }
    const url = `${environment.baseUrl}patients${queryString}`;
    return this.http.get<any>(url);
  }

  getPatientData(id: any) {
    const url = `${environment.baseUrl}patients/${id}`
    return this.http.get<any>(url);
  }

  getAppointmentData(id: any, date: any) {
    const url = `${environment.baseUrl}visits/get_date_patient_wise_visits_details/?patient_id=${id}&scheduled_date=${date}`
    return this.http.get<any>(url);
  }
}
