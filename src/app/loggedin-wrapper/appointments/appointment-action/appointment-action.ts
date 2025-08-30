import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityService } from '../../../shared/services/utility.service';
import { AppointmentService } from '../appointment.service';


@Component({
  selector: 'app-appointment-action',
  standalone: false,
  templateUrl: './appointment-action.html',
  styleUrl: './appointment-action.scss'
})
export class AppointmentAction {
  appointmentForm!: FormGroup;

  patientAppointmentData = {
    firstName: 'Akash',
    lastName: 'Tewari',
    age: '30',
    mobile: '9899273448',
    gender: 'male',
    address: 'Kashipur',
    bloodGroup: 'B+',
    weight: '84',
    bloodPressureUpper: '120',
    bloodPressureLower: '80',
    temperature: '98.3',
    date: "2025-08-25T18:30:00.000Z",
    time: "2025-08-23T08:30:00.000Z",
    lastVisit: 'Nov 10, 2024',
    followUpVisit: '',
    currentVisit: 'Aug 23, 2025'
  };
  editAppointmentDetails = false;
  upiId = '9899273448@ptsbi';
  name = 'Ramesh';
  amount: any;
  qrData: any;
  showModal = false;
  paymentType: any = 'cash'
  showQR = false;
  formSubmitted = false;

  constructor(public fb: FormBuilder, public router: Router, public utilService: UtilityService, public appointmentService: AppointmentService) {
    this.appointmentForm = this.fb.group({
      firstName: [this.patientAppointmentData?.firstName, [Validators.required]],
      lastName: [this.patientAppointmentData?.lastName],
      age: [this.patientAppointmentData?.age, [Validators.required]],
      mobile: [this.patientAppointmentData?.mobile, [Validators.required]],
      gender: [this.patientAppointmentData?.gender, [Validators.required]],
      address: [this.patientAppointmentData?.address, [Validators.required]],
      currentVisit: [this.patientAppointmentData?.currentVisit],
      lastVisit: [this.patientAppointmentData?.lastVisit],
      bloodGroup: [this.patientAppointmentData?.bloodGroup],
      weight: [this.patientAppointmentData?.weight],
      bloodPressureUpper: [this.patientAppointmentData?.bloodPressureUpper],
      bloodPressureLower: [this.patientAppointmentData?.bloodPressureLower],
      temperature: [this.patientAppointmentData?.temperature],
      analysis: [''],
      advice: [''],
      tests: [''],
      followUpVisit: [this.patientAppointmentData?.followUpVisit],
      medicationDetails: this.fb.array([this.createElements()])
    })
  }

  get medicationDetails(): FormArray {
    return this.appointmentForm.get('medicationDetails') as FormArray;
  }

  createElements(): FormGroup {
    return this.fb.group({
      medicine: [''],
      type: ['tablet'],
      count: [1],
      morning: [false],
      afternoon: [false],
      night: [false],
      beforeMeal: [false],
      duration: [''],
      notes: ['']
    })
  }

  addMedicine() {
    this.medicationDetails.push(this.createElements())
  }

  removeMedicine(index: number) {
    if (this.medicationDetails.length > 1) {
      this.medicationDetails.removeAt(index);
    }
  }

  submitAppointment() {
    const form = this.appointmentForm.getRawValue();
    this.appointmentForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.appointmentForm.valid) {
      const form = this.appointmentForm.getRawValue();
      const date = new Date(form.date)
      const time = form.time
      date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds())
      const payload = {
        appointment_id: "string",
        analysis: "string",
        advice: "string",
        tests: "string",
        followUpVisit: "string",
        medicationDetails: [
          {
            medicine: "string",
            type: "tablet",
            count: 0,
            morning: true,
            afternoon: true,
            night: true,
            beforeMeal: true,
            afterMeal: true,
            duration: "string",
            notes: ""
          }
        ]
      }
      // {
      //   patient: {
      //     firstName: form.firstName,
      //     lastName: form.lastName,
      //     age: form.age,
      //     mobile: form.mobile,
      //     gender: form.gender,
      //     address: form.address,
      //     bloodGroup: form.bloodGroup,
      //     weight: form.weight,
      //     bloodPressureUpper: form.bloodPressureUpper,
      //     bloodPressureLower: form.bloodPressureLower,
      //     temperature: form.temperature,
      //     temperatureType: form.temperatureType,
      //   },
      //   schedule_date_time: date
      // };
      this.utilService.setSpinnerState(true);
      this.appointmentService.submitAppointment(this.utilService.transformObj(payload)).subscribe(
        (res: any) => {
          if (res?.success) {
            this.formSubmitted = false;
            this.utilService.setSpinnerState(false);
            this.utilService.showToastMessage({
              message: res.message,
              success: true,
            });
            this.router.navigate(['/appointments']);
          } else {
            this.formSubmitted = false;
            this.utilService.setSpinnerState(false);
            this.utilService.showToastMessage({
              message: res.message,
              success: false,
            });
          }
        },
        (err) => {
          this.formSubmitted = false;
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: err?.error?.message,
            success: false,
          });
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/appointments']);
  }

  editBasicDetails() {
    this.editAppointmentDetails = true;
  }

  cancelAppointmentDetails() {
    this.editAppointmentDetails = false;
  }

  submitAppointmentDetails() {
    this.editAppointmentDetails = false;
  }

  completePayment() {
    this.showModal= true;
    // const modal = new bootstrap.Modal(this.modal.nativeElement)
    // this.modalComponent.open();
  }

  generateQR() {
    this.qrData = `upi://pay?pa=${this.upiId}&pn=${this.name}` +
      (this.amount && this.amount > 0 ? `&am=${this.amount}&cu=INR` : `&cu=INR`);
    this.showQR = true;
  }

  closeModal(data: any) {
    this.showModal = false;
  }

  print() {
    const popupWin = window.open('', '_blank', 'width=800,height=600');

  if (popupWin) {
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
          .print-wrapper {
          margin-top: 30%;
          padding: 1rem;
          }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="print-wrapper">
          CONTENT GOES HERE...!
          </div>
        </body>
      </html>
    `);
    popupWin.document.close();
  }
  }

}
