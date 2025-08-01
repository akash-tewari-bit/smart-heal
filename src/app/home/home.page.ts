import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  appointments = [
    {
      name: 'Akash',
      time: '12:00 pm',
      reason: 'Fever'
    },
    {
      name: 'Akash',
      time: '12:00 pm',
      reason: 'Fever'
    },
    {
      name: 'Akash',
      time: '12:00 pm',
      reason: 'Fever'
    }
  ]

  constructor() {}

}
