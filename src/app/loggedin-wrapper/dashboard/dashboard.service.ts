import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(public http: HttpClient) { }

  getDashboardSummaryCounts(data: any) {
    let params = new HttpParams();
    if (data?.startDate) {
      params = params.set('startDate', data?.startDate);
    }
    if (data?.endDate) {
      params = params.set('endDate', data?.endDate);
    }
    let url = `${environment.baseUrl}dashboard/summary`;
    return this.http.get<any>(url, { params });
  }
  
}
