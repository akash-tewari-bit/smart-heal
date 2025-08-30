import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = 'app/shared/mock-json/auth.json'
  registerUrl = environment.baseUrl + 'auth/register'
  loginUrl = environment.baseUrl + 'auth/login'
  forgotPasswordUrl = environment.baseUrl + 'auth/forgot-password'
  verifyOtpUrl = environment.baseUrl + 'auth/verify-otp';
  resetPasswordUrl = environment.baseUrl + 'auth/reset-password';

  constructor(public http: HttpClient) { }

  register(payload: any) {
    return this.http.post<any>(this.registerUrl, payload);
  }

  login(payload: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, payload);
  }

  forgotPassword(payload: any): Observable<any> {
    return this.http.post<any>(this.forgotPasswordUrl, payload);
  }

  verifyOtp(payload: any): Observable<any> {
    return this.http.post<any>(this.verifyOtpUrl, payload);
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post<any>(this.resetPasswordUrl, payload);
  }

  userIsLoggedIn(): boolean {
    const token = this.getToken();
    return !!token
    // return true
  }

  getToken(): any {
    const token = localStorage.getItem('token');
    return token;
  }
}
