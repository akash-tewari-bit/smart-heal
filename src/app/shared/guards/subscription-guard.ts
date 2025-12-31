import { CanActivateFn } from '@angular/router';

export const subscriptionGuard: CanActivateFn = (route, state) => {
  const configurations: any = JSON.parse(localStorage.getItem('configurations')!);
  
  if(!configurations?.subscription?.plan_name) {
    return false
  }
  return true;
};
