import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  
  if(userDetails?.role != 'admin' && userDetails?.role != 'owner') {
    router.navigate(['/dashboard']);
    return true
  }
  return true;
};
