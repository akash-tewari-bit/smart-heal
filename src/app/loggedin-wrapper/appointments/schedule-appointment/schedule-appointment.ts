import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../appointment.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule-appointment',
  standalone: false,
  templateUrl: './schedule-appointment.html',
  styleUrl: './schedule-appointment.scss',
})
export class ScheduleAppointment {
  appointmentForm!: FormGroup;
  todayDate = new Date();
  formSubmitted = false;
  validateExistingPatientForm!: FormGroup;
  showScheduleAppoitmentForm = false;
  patientsList: any = [];
  timeOptions: any = [];
  interval = 15;
  bookedSlots: any = [];

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public appointmentService: AppointmentService,
    public utilService: UtilityService,
    public datePipe: DatePipe
  ) {
    this.validateExistingPatientForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]*$')]],
      patient: ['']
    })
    this.appointmentForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      age: [''],
      mobile: ['', [Validators.required]],
      gender: [''],
      address: [''],
      bloodGroup: [''],
      weight: [''],
      bloodPressureUpper: [''],
      bloodPressureLower: [''],
      temperature: [''],
      temperatureType: ['celsius'],
      date: [{ value: '', disabled: false }, [Validators.required]],
      time: [{ value: '', disabled: false }, [Validators.required]],
    });
  }

  ngOnInit() {
    this.todayDate.setHours(0, 0, 0, 0);
  }

  createAppointment() {
    const form = this.appointmentForm.getRawValue();
    this.appointmentForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.appointmentForm.valid) {
      const [hours, minutes] = form.time.split(':').map(Number);
      const date = this.datePipe.transform(form.date, 'MM/dd/yyyy')
      const time = this.datePipe.transform((new Date()).setHours(hours, minutes, 0, 0), 'HH:mm:ss')
      const payload = {
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
          patient_id: this.validateExistingPatientForm.value.patient == 'new' ? null : this.validateExistingPatientForm.value.patient
        },
        scheduled_date: date,
        scheduled_time: time
      };
      this.utilService.setSpinnerState(true);
      this.appointmentService.schduleAppointment(this.utilService.transformObj(payload)).subscribe(
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

  addEvent(data: any) {
    this.checkBookedSlots();
  }

  checkBookedSlots() {
    const form = this.appointmentForm.getRawValue();
    const date = this.datePipe.transform(form.date, 'yyyy-MM-dd')
    this.appointmentService.getBookedSlots(date).subscribe((res: any) => {
      console.log(res);
      this.bookedSlots = res?.data;
      this.generateTimeOptions();
    },
    err => {

    })
  }

  validatePatient() {
    this.formSubmitted = true;
    this.validateExistingPatientForm.markAllAsTouched();
    if(this.validateExistingPatientForm.valid) {
      this.formSubmitted = false;
      if(!this.validateExistingPatientForm.get('patient')?.value) {
        this.checkPatientsList();
      }
      else {
        this.showScheduleAppoitmentForm = true;
        setTimeout(() => {
         this.populateData(); 
        });
      }
    }
  }

  checkPatientsList() {
    this.utilService.setSpinnerState(true);
    this.appointmentService.getPatientsList(this.validateExistingPatientForm.get('mobile')?.value).subscribe((res: any) => {
      this.utilService.setSpinnerState(false);
      if(res?.data?.patient_list?.length) {
        this.patientsList = res?.data?.patient_list;
        this.validateExistingPatientForm.get('patient')?.setValidators([Validators.required])
        this.validateExistingPatientForm.get('patient')?.updateValueAndValidity()
      }
      else {
        this.showScheduleAppoitmentForm = true;
        setTimeout(() => {
         this.populateData(); 
        });
      }
    }, err => {
      this.utilService.setSpinnerState(false);
    })
  }

  populateData() {
    console.log(this.validateExistingPatientForm.value);
    
    this.appointmentForm.get('mobile')?.setValue(this.validateExistingPatientForm.get('mobile')?.value)
    if(this.validateExistingPatientForm.get('patient')?.value) {
      const index = this.patientsList.findIndex((e: any) => e.patient_id == this.validateExistingPatientForm.get('patient')?.value)
      if(index > -1) {
        this.appointmentForm.get('firstName')?.setValue(this.patientsList[index].firstName)
        this.appointmentForm.get('lastName')?.setValue(this.patientsList[index].lastName)
      }
    }
  }

  generateTimeOptions() {
    this.timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += this.interval) {
        const time = this.formatTime(hour, minute);
        const disabled = this.bookedSlots.includes(time);
        this.timeOptions.push({ time, disabled });
      }
    }
  }

  formatTime(hour: number, minute: number): string {
    const hh = hour.toString().padStart(2, '0');
    const mm = minute.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }
}
