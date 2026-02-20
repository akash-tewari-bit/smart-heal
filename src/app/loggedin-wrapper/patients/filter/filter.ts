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
  ageList: any = [
    { label: 'Below 20', value: '<20' },
    { label: '20 to 30', value: '20-30' },
    { label: '30 to 40', value: '30-40' },
    { label: '40 to 50', value: '40-50' },
    { label: 'Above 50', value: '>50' }
  ]
  text: any = ''
  month: any = ''
  age: any = ''
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
      startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
      // month: this.month,
      ...this.getAgeValue()
    }
    this.filterData.emit(obj);
  }

  resetRecords() {
    this.text = '';
    // this.month = '';
    this.age = '';
    this.startDate = new Date();
    this.endDate = new Date();
    this.updateRecords();
  }

  getAgeValue() {
    if(this.age) {
      let obj: any = {
        minAge: '',
        maxAge: ''
      }
      if(this.age == '<20') {
        obj.minAge = 0;
        obj.maxAge = 20;
      }
      else if(this.age == '20-30') {
        obj.minAge = 20;
        obj.maxAge = 30;
      }
      else if(this.age == '30-40') {
        obj.minAge = 30;
        obj.maxAge = 40;
      }
      else if(this.age == '40-50') {
        obj.minAge = 40;
        obj.maxAge = 50;
      }
      else if(this.age == '>50') {
        obj.minAge = 50;
        obj.maxAge = -1;
      }
        return obj
    }
    return {}
  }

  addEvent(event: any) {
    if(this.startDate && this.endDate) {
      // this.updateRecords();
    }
  }
}
