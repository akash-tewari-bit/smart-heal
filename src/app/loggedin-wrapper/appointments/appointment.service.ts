import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import medicinesData from '../../shared/mock-json/medicines.json';

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

  getAppointmentsList(config: any, filter?: any) {
    let queryString = '';
    if(config?.page) {
      queryString += `?page=${config?.page}`
    }
    if(config?.pageSize) {
      queryString += `&page_size=${config?.pageSize}`
    }
    if(filter) {
      if(filter?.text) {
        queryString += `&text=${filter?.text}`
      }
      if(filter?.month) {
        queryString += `&month=${filter?.month}`
      }
      if(filter?.status) {
        queryString += `&status=${filter?.status}`
      }
      if(filter?.startDate) {
        queryString += `&startDate=${filter?.startDate}`
      }
      if(filter?.endDate) {
        queryString += `&endDate=${filter?.endDate}`
      }
    }
    let url = `${environment.baseUrl}appointments${queryString}`
    return this.http.get<any>(url);
  }

  getAppointmentsData(id: any) {
    const url = `${environment.baseUrl}appointments/${id}`
    return this.http.get<any>(url);
  }

  submitAppointment(payload: any) {
    const url = `${environment.baseUrl}visits/add_visits`
    return this.http.post<any>(url, payload);
  }

  getBookedSlots(date: any) {
    const url = `${environment.baseUrl}appointments/booked_slots/get_date_wise_booked_slots?appointment_date=${date}`
    return this.http.get<any>(url);
  }

  getPatientsList(number: any) {
    const url = `${environment.baseUrl}patients/get_patients_list_on_basis_of_mobile/${number}`
    return this.http.get<any>(url);
  }

  makePayment(payload: any) {
    const url = `${environment.baseUrl}billings/create_billing`
    return this.http.post<any>(url, payload);
  }

  updateAppointment(id: any, payload: any) {
    const url = `${environment.baseUrl}appointments/update_appointment/${id}`
    return this.http.post<any>(url, payload);
  }

  /**
   * Filter medicines by name (case-insensitive)
   * @param query Search query
   * @returns Filtered medicines array
   */
  getFilteredMedicineList(query: any, list: any[]) {
    // Return empty array if query is empty or not provided
    if (!query || query.trim() === '') {
      return [];
    }

    // Convert query to lowercase for case-insensitive search
    const lowerCaseQuery = query.toLowerCase().trim();
    // Filter medicines by Medicine Name
    const filtered = list.filter((medicine: any) =>
      medicine['medicine_name']?.toLowerCase().includes(lowerCaseQuery)
  );

    return filtered;
  }
  
}
