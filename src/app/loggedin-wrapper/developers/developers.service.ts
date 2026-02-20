import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {

  constructor(private http: HttpClient) { }

  getDevelopersList() {
    let params = new HttpParams();
    // if (data?.startDate) {
    //   params = params.set('startDate', data?.startDate);
    // }
    // if (data?.endDate) {
    //   params = params.set('endDate', data?.endDate);
    // }
    let url = `${environment.baseUrl}developers/get_all_users_list`;
    return this.http.get<any>(url, { params });
  }

  getDeveloperDetails(id: any) {
    let url = `${environment.baseUrl}developers/${id}`;
    return this.http.get<any>(url);
  }

  updateDeveloperDetails(payload: any) {
    let url = `${environment.baseUrl}developers/users/`;
    return this.http.put<any>(url, payload);
  }
}
