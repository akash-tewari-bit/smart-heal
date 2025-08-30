import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  showSpinner = new BehaviorSubject<any>(false);
  showToast = new BehaviorSubject<any>(null);

  constructor() { }

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
      else if(!data[item]) {
        data[item] = null
      }
    }
    return data
  }
}
