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

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public appointmentService: AppointmentService,
    public utilService: UtilityService,
    public datePipe: DatePipe
  ) {
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
      date: [{ value: null, disabled: false }, [Validators.required]],
      time: [{ value: null, disabled: false }, [Validators.required]],
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
      const date = this.datePipe.transform(form.date, 'MM/dd/yyyy')
      const time = this.datePipe.transform(form.time, 'HH:mm:ss')
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
      
    },
    err => {

    })
  }
}
