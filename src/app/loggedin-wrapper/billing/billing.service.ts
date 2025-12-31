import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  environment = environment;

  constructor(public http: HttpClient) {}

  getBillingDetails(config: any, data: any) {
    let queryString = '';
    if (config?.page) {
      queryString += `?page=${config?.page}`;
    }
    if (config?.pageSize) {
      queryString += `&page_size=${config?.pageSize}`;
    }
    if (data?.startDate) {
      queryString += `&startDate=${data?.startDate}`;
    }
    if (data?.endDate) {
      queryString += `&endDate=${data?.endDate}`;
    }
    if (data?.type) {
      queryString += `&type=${data?.type}`;
    }
    let url = `${environment.baseUrl}billings/billing_details${queryString}`;
    return this.http.get<any>(url);
  }

  getBillingSummary(data: any) {
    let params = new HttpParams();
    if (data?.startDate) {
      params = params.set('startDate', data?.startDate);
    }
    if (data?.endDate) {
      params = params.set('endDate', data?.endDate);
    }
    let url = `${environment.baseUrl}billings/billing_summary`;
    return this.http.get<any>(url, { params });
  }
}
