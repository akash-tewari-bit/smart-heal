import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  showSpinner = new BehaviorSubject<any>(false);

  constructor() { }

  setSpinnerState(data: boolean) {
    return this.showSpinner.next(data);
  }
}
