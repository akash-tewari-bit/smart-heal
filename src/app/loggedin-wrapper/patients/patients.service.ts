import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
    environment = environment;

    constructor(public http: HttpClient) {}

  getPatientsList() {
      const url = `${environment.baseUrl}patients/get_patients_list`
      return this.http.get<any>(url);
    }
  
}
