import { Component } from '@angular/core';

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
  age: any = [
    'Below 20',
    '20 to 30',
    '30 to 40',
    '40 to 50',
    'Above 50',
  ]
}
