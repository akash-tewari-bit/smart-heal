import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffManagementService {
  environment = environment;
  updateStaffCount = new Subject<any>();

  constructor(public http: HttpClient) {}

  addStaff(payload: any) {
    const url = `${environment.baseUrl}staff/register`
    return this.http.post<any>(url, payload);
  }

  getStaffList() {
    const url = `${environment.baseUrl}staff/staff_list`
    return this.http.get<any>(url);
  }

  deleteStaff(payload: any) {
    const url = `${environment.baseUrl}staff/delete`
    return this.http.post<any>(url, payload);
  }

  getStaffDetails(id: any) {
    const url = `${environment.baseUrl}staff/staff_details/${id}`
    return this.http.get<any>(url);
  }

  updateStaff(payload: any) {
    const url = `${environment.baseUrl}staff/update`
    return this.http.post<any>(url, payload);
  }

  notifyStaffCountUpdate(data: boolean) {
    this.updateStaffCount.next(data);
  }
  
}
