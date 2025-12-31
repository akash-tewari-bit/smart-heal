import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  environment = environment;

  constructor(public http: HttpClient) {}

  getNotificationsList(filter?: any) {
    let queryString = '';
    // if (config?.page) {
    //   queryString += `?page=${config?.page}`;
    // }
    // if (config?.pageSize) {
    //   queryString += `&page_size=${config?.pageSize}`;
    // }
    if (filter) {
      if (filter?.startDate) {
        queryString += `?startDate=${filter?.startDate}`;
      }
      if (filter?.endDate) {
        queryString += `&endDate=${filter?.endDate}`;
      }
      if (filter?.status) {
        queryString += `&status=${filter?.status}`;
      }
    }
    let url = `${environment.baseUrl}notifications${queryString}`;
    return this.http.get<any>(url);
  }

  markNotificationAsRead(payload: any) {
    const url = `${environment.baseUrl}notifications/mark_as_read`;
    return this.http.post<any>(url, payload);
  }
}
