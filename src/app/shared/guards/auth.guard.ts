import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const userLoggedIn = authService.userIsLoggedIn()
  
  if(state.url === '/' || state.url === '') {
    if(userLoggedIn) {
      router.navigate(['/dashboard']);
    }
    else {
      router.navigate(['/auth/login']);
    }
    return true
  }
  if(!userLoggedIn) {
    router.navigate(['/auth/login']);
    return true
  }
  return true;
};
