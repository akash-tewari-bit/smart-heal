import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  patientAppointmentData: any = [];
  // patientAppointmentData = {
  //   firstName: 'Akash',
  //   lastName: 'Tewari',
  //   age: '30',
  //   mobile: '9899273448',
  //   gender: 'male',
  //   address: 'Kashipur',
  //   bloodGroup: 'B+',
  //   weight: '84',
  //   bloodPressureUpper: '120',
  //   bloodPressureLower: '80',
  //   temperature: '98.3',
  //   date: "2025-08-25T18:30:00.000Z",
  //   time: "2025-08-23T08:30:00.000Z",
  //   lastVisit: 'Nov 10, 2024',
  //   followUpVisit: '',
  //   currentVisit: 'Aug 23, 2025'
  // };
  editAppointmentDetails = false;
  upiId = '9899273448@ptsbi';
  name = 'Akash Deep Tewari';
  amount: any;
  qrData: any;
  showModal = false;
  paymentType: any = 'cash'
  showQR = false;
  formSubmitted = false;
  appointmentId: any;
  showPrintAndPaymentOption: any = false;
  @ViewChild('printData') printData!: ElementRef;

  constructor(public fb: FormBuilder, public router: Router, public utilService: UtilityService, public appointmentService: AppointmentService, public activatedRoute: ActivatedRoute) {
    this.initiateForm();
  }

  ngOnInit() {
    this.appointmentId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.appointmentId) {
      setTimeout(() => { 
        this.getAppointmentDetails();
      });
    }
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

  getAppointmentDetails() {
    this.utilService.setSpinnerState(true);
    this.appointmentService.getAppointmentsData(this.appointmentId).subscribe(
      (res: any) => {
        console.log(res);
        
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.patientAppointmentData = res?.data;

          // this.patientAppointmentData['status'] = 2; //Mock status - to be removed after implementing from backend
          // this.patientAppointmentData['medicationDetails'] = [
          //   {
          //     medicine: 'Dolo 500',
          //     type: 'tablet',
          //     count: 1,
          //     morning: true,
          //     afternoon: false,
          //     night: true,
          //     beforeMeal: false,
          //     duration: '1 Week',
          //     notes: 'SOS'
          //   },
          //   {
          //     medicine: 'Dolo 500',
          //     type: 'syrup',
          //     count: '10 ML',
          //     morning: true,
          //     afternoon: true,
          //     night: true,
          //     beforeMeal: true,
          //     duration: '1 Week',
          //     notes: 'SOS'
          //   }
          // ]

          this.initiateForm(this.patientAppointmentData);
        }
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

  submitAppointment() {
    this.showPrintAndPaymentOption = false;
    this.appointmentForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.appointmentForm.valid) {
      const form = this.appointmentForm.getRawValue();
      const payload: any = {
        appointment_id: this.appointmentId,
        analysis: form.analysis,
        advice: form.advice,
        tests: form.tests,
        followUpVisit: form.followUpVisit,
        medicationDetails: []
      }
      form.medicationDetails.forEach((e: any) => {
        let obj = {
          medicine: e.medicine,
          type: e.type,
          count: e.count,
            morning: e.morning,
            afternoon: e.afternoon,
            night: e.night,
            beforeMeal: e.beforeMeal ? true : false,
            afterMeal: e.beforeMeal ? false : true,
            duration: e.duration,
            notes: e.notes
          }
          payload.medicationDetails.push(obj)
        })
        console.log(payload);
      this.utilService.setSpinnerState(true);
      this.appointmentService.submitAppointment(this.utilService.transformObj(payload)).subscribe(
        (res: any) => {
          if (res?.success) {
            this.showPrintAndPaymentOption = true;
            this.formSubmitted = false;
            this.utilService.setSpinnerState(false);
            this.utilService.showToastMessage({
              message: res.message,
              success: true,
            });
            // this.router.navigate(['/appointments']);
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
          width: 100%;
          border: 2px solid red;
          }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="container-fluid print-wrapper">
          ${this.printData.nativeElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    popupWin.document.close();
  }
  }

  initiateForm(data?: any) {
    this.appointmentForm = this.fb.group({
      firstName: [data?.firstName ?? null, [Validators.required]],
      lastName: [data?.lastName ?? null],
      age: [data?.age ?? null],
      mobile: [data?.mobile ?? null, [Validators.required]],
      gender: [data?.gender ?? null],
      address: [data?.address ?? null],
      lastVisit: [data?.lastVisit ?? null],
      bloodGroup: [data?.bloodGroup ?? null],
      weight: [data?.weight ?? null],
      bloodPressureUpper: [data?.bloodPressureUpper ?? null],
      bloodPressureLower: [data?.bloodPressureLower ?? null],
      temperature: [data?.temperature ?? null],
      analysis: [''],
      advice: [''],
      tests: [''],
      followUpVisit: [data?.followUpVisit ?? null],
      medicationDetails: this.fb.array([this.createElements()])
    })
  }

  seePatientHistory() {
    this.router.navigate(['patients', this.patientAppointmentData.patient_id])
  }

}
