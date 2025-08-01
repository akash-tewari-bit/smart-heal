import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = 'app/shared/mock-json/auth.json'

  constructor(public http: HttpClient) { }

  login(payload: any): Observable<any> {
    // return this.http.post<any>('https://health.free.beeceptor.com/login', payload);
    return this.http.post<any>('https://getdatathroughapi-production.up.railway.app/src/login', payload);
  }
}
