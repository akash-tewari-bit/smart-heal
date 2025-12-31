import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  showSpinner = new BehaviorSubject<any>(false);
  showToast = new BehaviorSubject<any>(null);
  environment = environment;

  constructor(public http: HttpClient) { }

  setSpinnerState(data: boolean) {
    return this.showSpinner.next(data);
  }

  showToastMessage(data: any) {
    return this.showToast.next(data);
  }

  transformObj(data: any) {
    for(var item in data) {
      if(data[item] && typeof data[item] == 'object') {
        this.transformObj(data[item])
      }
      else if(typeof data[item] != 'boolean' && !data[item]) {
        data[item] = null
      }
    }
    return data
  }

  search(query: string): Observable<any[]> {
  return this.http.get<any[]>(`${environment.baseUrl}dashboard/search?text=${query}`);
}
}
