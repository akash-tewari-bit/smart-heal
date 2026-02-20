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
    let params = new HttpParams();
    if (config?.page) {
      params = params.set('page', config?.page);
    }
    if (config?.pageSize) {
      params = params.set('page_size', config?.pageSize);
    }
    if (data?.startDate) {
      params = params.set('startDate', data?.startDate);
    }
    if (data?.endDate) {
      params = params.set('endDate', data?.endDate);
    }
    if (data?.type) {
      params = params.set('type', data?.type);
    }
    let url = `${environment.baseUrl}billings/billing_details`;
    return this.http.get<any>(url, { params });
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

  deletePaymentBilling(payload: any) {
    let url = `${environment.baseUrl}billings/delete_billing`;
    return this.http.post<any>(url, payload);
  }
}
