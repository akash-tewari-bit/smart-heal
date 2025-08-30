import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, public router: Router, public utilService: UtilityService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let requestToSend = req;

    if (token) {
      requestToSend = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(requestToSend).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err?.error?.status_code === 401) {
          // Token expired or invalid - redirect to login
          // this.authService.logout(); // optional: clear token
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({message: err?.error?.message, success: false});
          this.router.navigate(['/auth/login']);
          return EMPTY;
        }

        return throwError(() => err);
      })
    );

    // return next.handle(req);
  }
}
