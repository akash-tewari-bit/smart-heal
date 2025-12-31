import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter {
  months: any = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  statuses: any = [
    'Upcoming',
    'Completed',
    'No Show'
  ];
  text: any = ''
  month: any = ''
  status: any = ''
  @Output() filterData = new EventEmitter<any>();

  updateRecords() {
    const obj = {
      text: this.text,
      month: this.month,
      status: this.status
    }
    this.filterData.emit(obj);
  }

  resetRecords() {
    this.text = '';
    this.month = '';
    this.status = '';
    this.updateRecords();
  }
}
