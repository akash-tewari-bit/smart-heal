import { DatePipe } from '@angular/common';
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
  startDate: any = new Date();
  endDate: any = new Date();
  isMobile = window.innerWidth < 768;

  constructor(public datePipe: DatePipe) { }

  ngOnInit() {
    setTimeout(() => {
     this.updateRecords();
    });
  }

  updateRecords() {
    const obj = {
      text: this.text,
      // month: this.month,
      status: this.status,
      startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
    }
    this.filterData.emit(obj);
  }

  resetRecords() {
    this.text = '';
    // this.month = '';
    this.status = '';
    this.startDate = new Date();
    this.endDate = new Date();
    this.updateRecords();
  }

  addEvent(event: any) {
    if(this.startDate && this.endDate) {
      // this.updateRecords();
    }
  }
}
