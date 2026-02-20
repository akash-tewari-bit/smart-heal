import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {
  paymentType: any = '';
  // startDate: any;
  // endDate: any;
  @Output() filterData = new EventEmitter<any>();
  @Input() hasSelectedBilling: any = [];

  ngOnInit() {
    // const today = new Date();
    // this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    // this.endDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
    // this.updateRecords();
  }

  updateRecords() {
    // this.startDate.setHours(0)
    // this.startDate.setMinutes(0)
    // this.startDate.setSeconds(0)
    // this.endDate.setHours(23)
    // this.endDate.setMinutes(59)
    // this.endDate.setSeconds(59)
    const obj = {
      paymentType: this.paymentType,
      // startDate: this.startDate,
      // endDate: this.endDate,
    }
    this.filterData.emit(obj);
  }

  resetRecords() {
    this.paymentType = '';
    // this.startDate = '';
    // this.endDate = '';
    this.updateRecords();
  }

  deleteBilling() {
    const obj = {
      action: 'delete',
    }
    this.filterData.emit(obj);
  }

}
