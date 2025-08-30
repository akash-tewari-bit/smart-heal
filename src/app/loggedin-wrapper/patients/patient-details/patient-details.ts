import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-details',
  standalone: false,
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.scss'
})
export class PatientDetails {
  patientDetailForm!: FormGroup;
  patientDetail: any;

  constructor(public fb: FormBuilder, public router: Router) {
    this.patientDetailForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      time: [''],
      age: [''],
      email: [''],
      mobile: [''],
      reason: [''],
      lastVisit: [''],
      weight: [''],
      temperature: [''],
      bloodPressure: [''],
      gender: [''],
      address: [''],
      bloodGroup: ['']
    })
  }

  ngOnInit() {
    this.patientDetailForm.setValue({
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
    })
    this.patientDetail = this.patientDetailForm.value
    
  }

  cancel() {
    this.router.navigate(['patients'])
  }

}
