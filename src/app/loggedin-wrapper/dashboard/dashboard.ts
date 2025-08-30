import { Component } from '@angular/core';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  upcomingAppointments: any = [
    {
      id: 1,
      patientName: 'Paul Richard',
      time: '10:00 AM',
      reason: 'New Patient'
    },
    {
      id: 1,
      patientName: 'Anil Agarwal',
      time: '01:00 PM',
      reason: 'Follow-up'
    },
    {
      id: 1,
      patientName: 'Ravi Sahota',
      time: '10:00 AM',
      reason: 'New Patient'
    },
    {
      id: 1,
      patientName: 'Anil Agarwal',
      time: '01:00 PM',
      reason: 'Follow-up'
    }
  ]

}
