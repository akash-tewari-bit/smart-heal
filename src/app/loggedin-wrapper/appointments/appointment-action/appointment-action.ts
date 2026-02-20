import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../../shared/services/utility.service';
import { AppointmentService } from '../appointment.service';
import { SettingsService } from '../../settings/settings.service';
import { DatePipe } from '@angular/common';
import { MedicineManagementService } from '../../medicine-management/medicine-management.service';


@Component({
  selector: 'app-appointment-action',
  standalone: false,
  templateUrl: './appointment-action.html',
  styleUrl: './appointment-action.scss'
})
export class AppointmentAction {
  appointmentForm!: FormGroup;
  patientAppointmentData: any = '';
  editAppointmentDetails = false;
  upiId = '';
  name = '';
  currency = '';
  amount: any;
  qrData: any;
  showModal = false;
  paymentType: any = 'cash'
  showQR = false;
  formSubmitted = false;
  appointmentId: any;
  showPrintAndPaymentOption: any = false;
  @ViewChild('printData') printData!: ElementRef;
  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  timeOptions: any = [];
  interval = 15;
  bookedSlots: any = [];
  todayDate = new Date();
  autoCompleteData: any = [];
  selectedInputIndex = -1;
  medicineList: any = [];
  appointmentsLeft: any = 0;
  noAppointmentSchedulingText1: any;
  noAppointmentSchedulingText2: any;

  constructor(public fb: FormBuilder, public router: Router, public utilService: UtilityService, public appointmentService: AppointmentService, public activatedRoute: ActivatedRoute, public settingsService: SettingsService, public datePipe: DatePipe, public medicineManagementService: MedicineManagementService) {
    this.initiateForm();
  }

  ngOnInit() {
    this.todayDate.setHours(0, 0, 0, 0);
    this.appointmentId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.appointmentId) {
      setTimeout(() => { 
        this.getAppointmentDetails();
        this.getMedicineList();
      });
    }
  }

  ngAfterContentChecked() {
    this.appointmentsLeft = this.utilService.configurations?.subscription?.appointment_left ?? 0;
    const todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    if(todayDate !== null && todayDate > this.utilService.configurations?.subscription?.end_date) {
      this.noAppointmentSchedulingText1 = this.utilService.subscriptionExpiredText;
      this.noAppointmentSchedulingText2 = this.utilService.renewPlanText;
    }
    if(todayDate !== null && todayDate <= this.utilService.configurations?.subscription?.end_date) {
      if(!this.appointmentsLeft) {
        this.noAppointmentSchedulingText1 = this.utilService.appointmentLimitReachedText;
        this.noAppointmentSchedulingText2 = this.utilService.upgradePlanText;
      }
    }
  }

  get medicationDetails(): FormArray {
    return this.appointmentForm.get('medicationDetails') as FormArray;
  }

  createElements(): FormGroup {
    return this.fb.group({
      medicine: [''],
      composition: [''],
      type: ['tablet'],
      count: ['1'],
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
    this.upiConfiguration();
    this.utilService.setSpinnerState(true);
    this.appointmentService.getAppointmentsData(this.appointmentId).subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.patientAppointmentData = res?.data;
          if (this.patientAppointmentData?.paymentDetails?.length) {
            this.patientAppointmentData['consolidatedPaymentDetails'] = [];
            let obj: any = {};
          this.patientAppointmentData?.paymentDetails?.forEach((ev: any) => {
                if (obj[ev.type]) {
                  obj[ev.type] += ev.amount;
                } else {
                  obj[ev.type] = ev.amount;
                }
              });
              this.patientAppointmentData['consolidatedPaymentDetails'] = Object.entries(obj).map(
                ([type, amount]) => ({
                  type,
                  amount,
                })
              );
            }
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
        followUpVisit: this.datePipe.transform(form.followUpVisit, 'yyyy-MM-dd'),
        medicationDetails: []
      }
      form.medicationDetails.forEach((e: any) => {
        let obj = {
          medicine: e.medicine,
          composition: e.composition,
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
            this.getAppointmentDetails();
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
    this.appointmentForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.appointmentForm.valid) {
      const form = this.appointmentForm.getRawValue();
      const convertedTime = this.utilService.convertTimeFormat(true, form.time);
      const [hours, minutes] = convertedTime.split(':').map(Number);
      const date = this.datePipe.transform(form.date, 'MM/dd/yyyy')
      const time = this.datePipe.transform((new Date()).setHours(hours, minutes, 0, 0), 'HH:mm:ss')
      const payload: any = {
        patient: {
          firstName: form.firstName,
          lastName: form.lastName,
          age: form.age,
          mobile: form.mobile,
          gender: form.gender,
          address: form.address,
          bloodGroup: form.bloodGroup,
          weight: form.weight,
          bloodPressureUpper: form.bloodPressureUpper,
          bloodPressureLower: form.bloodPressureLower,
          temperature: form.temperature,
          temperatureType: form.temperatureType,
          pulseRate: form.pulseRate,
          patient_id: this.patientAppointmentData?.patient_id ?? null
        },
        scheduled_date: date,
        scheduled_time: time
      }
      this.utilService.setSpinnerState(true);
      this.appointmentService.updateAppointment(this.appointmentId, this.utilService.transformObj(payload)).subscribe(
        (res: any) => {
          if (res?.success) {
            this.editAppointmentDetails = false;
            this.formSubmitted = false;
            this.utilService.setSpinnerState(false);
            this.utilService.showToastMessage({
              message: res.message,
              success: true,
            });
            this.getAppointmentDetails();
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

  completePayment() {
    this.showModal= true;
    this.amount = '';
    this.showQR = false;
    this.paymentType = 'cash';
    // const modal = new bootstrap.Modal(this.modal.nativeElement)
    // this.modalComponent.open();
  }

  generateQR() {
    if(this.amount) { 
      this.qrData = `upi://pay?pa=${this.upiId}&pn=${this.name}` +
      (this.amount && this.amount > 0 ? `&am=${this.amount}&cu=${this.currency}` : `&cu=${this.currency}`);
      this.showQR = true;
    }
  }

  closeModal(data?: any) {
    this.showModal = false;
  }

  print() {
    const popupWin = window.open('', '_blank', 'width=800,height=600');

  if (popupWin) {
    const bootstrapLink = `<link rel="stylesheet" href="./styles.css">`;
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print</title>
          ${bootstrapLink}
          <style>
          .print-wrapper {
          margin-top: 30%;
          width: 100%;
          padding-right: 80px;
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
      mobile: [data?.mobile ?? null, [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]*$')]],
      gender: [data?.gender ?? null],
      address: [data?.address ?? null],
      lastVisit: [data?.lastVisit ?? null],
      bloodGroup: [data?.bloodGroup ?? null],
      weight: [data?.weight ?? null],
      bloodPressureUpper: [data?.bloodPressureUpper ?? null],
      bloodPressureLower: [data?.bloodPressureLower ?? null],
      temperature: [data?.temperature ?? null],
      temperatureType: [{ value: data?.temperatureType ?? 'fahrenheit', disabled: true }],
      pulseRate: [data?.pulseRate ?? null],
      analysis: [''],
      advice: [''],
      tests: [''],
      followUpVisit: [data?.followUpVisit ?? null],
      medicationDetails: this.fb.array([this.createElements()]),
      date: [{ value: data?.scheduled_date ?? '', disabled: false }, [Validators.required]],
      time: [{ value: data?.scheduled_time ? this.utilService.convertTimeFormat(false, data?.scheduled_time) : '', disabled: false }, [Validators.required]],
    })
    if(data) {
      this.checkBookedSlots(data);
    }
  }

  seePatientHistory() {
    this.router.navigate(['patients', this.patientAppointmentData.patient_id])
  }

  successEvent(event: any) {
    if(!this.paymentType || !this.amount) {
      return
    }
    const payload = {
      appointment_id: this.appointmentId,
      type: this.paymentType,
      amount: Number(this.amount)
    }
    this.utilService.setSpinnerState(true);
    this.appointmentService.makePayment(payload).subscribe((res: any) => {
      if(res?.success) {
        this.closeModal();
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: res?.message,
          success: true,
        });
        setTimeout(() => { 
          this.getAppointmentDetails();
        });
      }
      else {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: res?.message,
          success: false,
        });
      }
    }, err => {
      this.utilService.setSpinnerState(false);
      this.utilService.showToastMessage({
        message: err?.error?.message,
        success: false,
      });
    })
  }

  upiConfiguration() {
    this.settingsService.getConfiguration().subscribe(
      (res: any) => {
        if(res?.success) {
          this.upiId = res?.data?.upi?.upi_id;
          this.name = res?.data?.upi?.name;
          this.currency = res?.data?.upi?.currency;
        }
      },
      (err: any) => {
      }
    );
  }

  addEvent(data: any, type?: any) {
    if(type === 'follow-up') {
      this.appointmentForm?.get('followUpVisit')?.setValue(data?.value);
    }
    else {
      this.checkBookedSlots();
    }
  }

  checkBookedSlots(data?: any) {
    const form = this.appointmentForm.getRawValue();
    const date = this.datePipe.transform(form.date, 'yyyy-MM-dd')
    this.appointmentService.getBookedSlots(date).subscribe((res: any) => {
      this.bookedSlots = res?.data;
      this.generateTimeOptions(data);
    },
    err => {

    })
  }

  generateTimeOptions(data?: any) {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += this.interval) {
        const time = this.formatTime(hour, minute);
        const disabled = this.bookedSlots.includes(time);
        this.timeOptions.push({ time: this.utilService.convertTimeFormat(false, time), disabled });
      }
    }
    if(data && data?.scheduled_time) this.appointmentForm?.get('time')?.setValue(this.utilService.convertTimeFormat(false, data?.scheduled_time));
  }

  formatTime(hour: number, minute: number): string {
    const hh = hour.toString().padStart(2, '0');
    const mm = minute.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  autoComplete(event: any, index: any) {
    this.medicationDetails.controls[index].get('composition')?.setValue('');
    this.selectedInputIndex = index;
    this.autoCompleteData = this.appointmentService.getFilteredMedicineList(event?.target?.value, this.medicineList);
  }
  
  selectMedicine(medicine: any, index: number) {
    this.medicationDetails.controls[index].get('medicine')?.setValue(medicine['medicine_name']);
    this.medicationDetails.controls[index].get('composition')?.setValue(medicine['composition']);
    this.autoCompleteData = [];
    this.selectedInputIndex = -1;
  }

  getMedicineList() {
    this.medicineList = [];
    this.medicineManagementService.getMedicinesList({}).subscribe(
      (res: any) => {
        if (res?.success) {
          this.medicineList = res?.data?.medicines_list;
        }
      }
    );
  }

  upgradePlan() {
    this.router.navigate(['/subscriptions']);
  }

}
