import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { PatientsService } from './patients.service';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class Patients {
  patients: any = [
    {
      id: 1,
      firstName: 'Paul',
      lastName: 'Richard',
      time: '10:00 AM',
      age: 20,
      email: 'test@example.com',
      mobile: '987654321',
      reason: 'New Patient',
      lastVisit: 'Nov 10, 2024',
      weight: '58 kgs',
      temperature: '98',
      bloodPressure: '120 / 80',
      gender: 'Male',
      address: 'Gurugram, Haryana',
      bloodGroup: 'B+'
    },
    {
      id: 2,
      firstName: 'Anil',
      lastName: 'Agarwal',
      time: '01:00 PM',
      age: 20,
      email: 'test@example.com',
      mobile: '987654321',
      reason: 'Follow-up',
      lastVisit: 'Nov 10, 2024',
      weight: '58 kgs',
      temperature: '98',
      bloodPressure: '120 / 80',
      gender: 'Male',
      address: 'Gurugram, Haryana',
      bloodGroup: 'B+'
    },
    {
      id: 3,
      firstName: 'Ravi',
      lastName: 'Sahota',
      time: '10:00 AM',
      age: 20,
      email: 'test@example.com',
      mobile: '987654321',
      reason: 'New Patient',
      lastVisit: 'Nov 10, 2024',
      weight: '58 kgs',
      temperature: '98',
      bloodPressure: '120 / 80',
      gender: 'Male',
      address: 'Gurugram, Haryana',
      bloodGroup: 'B+'
    },
    {
      id: 4,
      firstName: 'Anil',
      lastName: 'Agarwal',
      time: '01:00 PM',
      age: 20,
      email: 'test@example.com',
      mobile: '987654321',
      reason: 'Follow-up',
      lastVisit: 'Nov 10, 2024',
      weight: '58 kgs',
      temperature: '98',
      bloodPressure: '120 / 80',
      gender: 'Male',
      address: 'Gurugram, Haryana',
      bloodGroup: 'B+'
    }
  ]
  patientsList: any = [];

  constructor(public router: Router, public utilService: UtilityService, public patientService: PatientsService) {

  }

  ngOnInit() {
    setTimeout(() => { 
      this.getPatientsList();
    });
  }

  showPatientDetails(item: any) {
    this.router.navigate(['/patients', item.patient_id])
  }

  getPatientsList() {
    this.utilService.setSpinnerState(true);
    this.patientService.getPatientsList().subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) [
          this.patientsList = res?.data
        ]
        else {
          this.utilService.showToastMessage({
            message: res?.message,
            success: false,
          });
        }
      },
      (err: any) => {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err?.error?.message,
          success: false,
        });
      }
    );
  }

}
