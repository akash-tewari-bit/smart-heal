import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicineManagementService {

  constructor(public http: HttpClient) {}

  addMedicine(payload: any) {
    const url = `${environment.baseUrl}medicines/add`
    return this.http.post<any>(url, payload);
  }

  getMedicinesList(config?: any, data?: any) {
    let params = new HttpParams();
    if (config?.page) {
      params = params.set('page', config?.page);
    }
    if (config?.pageSize) {
      params = params.set('page_size', config?.pageSize);
    }
    if (data?.searchText) {
      params = params.set('search', data?.searchText);
    }
    let url = `${environment.baseUrl}medicines`;
    return this.http.get<any>(url, { params });
  }

  updateMedicine(payload: any) {
    const url = `${environment.baseUrl}medicines/update`
    return this.http.put<any>(url, payload);
  }

  deleteMedicine(payload: any) {
    const url = `${environment.baseUrl}medicines/delete`
    return this.http.post<any>(url, payload);
  }

  getMedicinesData(id: any) {
    let url = `${environment.baseUrl}medicines/${id}`;
    return this.http.get<any>(url);
  }
  
}
