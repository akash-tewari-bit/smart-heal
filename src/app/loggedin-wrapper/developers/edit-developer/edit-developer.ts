import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../../shared/services/utility.service';
import { DevelopersService } from '../developers.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-developer',
  standalone: false,
  templateUrl: './edit-developer.html',
  styleUrl: './edit-developer.scss'
})
export class EditDeveloper {

  clientDetail: any;
  todayDate = new Date();
  clientId: any;
  clientForm!: FormGroup;
  plans = [
    "Basic",
    "Professional",
    "Custom"
  ]

  constructor(public activatedRoute: ActivatedRoute, public utilService: UtilityService, public developersService: DevelopersService, public router: Router, public fb: FormBuilder, public datePipe: DatePipe ) {
    this.initiateForm();
  }

  ngOnInit() {
    // this.clientDetail = {
    //   id: "256a3a63-a0f3-4e7b-b89d-a423df05c0de",
    //   firstName: 'Stone',
    //   lastName: 'Cold',
    //   email: "madhur.munjal@yahoo.in",
    //   country: "india",
    //   mobile: "09654501184",
    //   username: "madhur_04",
    //   role: "owner",
    //   brandName: 'S Dental Clinic',
    //   subscription: 'Basic',
    //   subscription_startDate: '2026-01-20',
    //   subscription_endDate: '2026-12-30',
    //   isActive: true,
    //   appointment_left: 110,
    // };
    this.clientId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.clientId) {
      setTimeout(() => { 
        this.getDeveloperDetails();
      });
    }
  }

  addEvent(data: any) {
    // this.appointmentForm?.get('followUpVisit')?.setValue(data?.value);
  }

  getDeveloperDetails() {
    this.utilService.setSpinnerState(true);
    this.developersService.getDeveloperDetails(this.clientId).subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          // console.log(res);
          this.clientDetail = res?.data[0];
          // this.clientDetail.subscription.push(
          //   {
          //     created_at: "2025-12-14T09:28:53",
          //     is_active: false,
          //     plan_currency: "INR",
          //     plan_description: ["Access to Dashboard", "Appointment Scheduling (Upto 110 Appointments)", "View Patient Records", "Medicine Management", "Notification Alerts on Application", "Staff Management (Upto 3 Staff Members)", "Role Based Access Control for Staff Members"],
          //     plan_id: "902db423-f82a-462f-8066-318d767e002c",
          //     plan_name: "Basic",
          //     plan_price: 2500,
          //     subscription_endDate: "2026-01-10",
          //     subscription_id: "c7a8c913-a733-4c54-917f-6a2864ba4460",
          //     subscription_startDate: "2025-12-14",
          //     updated_at: "2025-12-14T09:28:53"
          //   }
          // );
          this.initiateForm(this.clientDetail);
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

  updateDeveloperDetails() {
    const activeSubscriptions = this.subscriptions.getRawValue().filter((item: any) => item.is_active);
    const payload = {
      user_id: this.clientId,
      firstName: this.clientForm?.get('firstName')?.value,
      lastName: this.clientForm?.get('lastName')?.value,
      mobile: this.clientForm?.get('mobile')?.value,
      email: this.clientForm?.get('email')?.value,
      country: this.clientForm?.get('country')?.value,
      staff_left_doctor: this.clientForm?.get('staff_left_doctor')?.value,
      staff_left_nondoctor: this.clientForm?.get('staff_left_nondoctor')?.value,
      subscription: {
        plan_name: activeSubscriptions?.length ? activeSubscriptions[0].plan_name : null,
        start_date: activeSubscriptions?.length ? this.datePipe.transform(activeSubscriptions[0].subscription_startDate, 'yyyy-MM-dd') : null,
        end_date: activeSubscriptions?.length ? this.datePipe.transform(activeSubscriptions[0].subscription_endDate, 'yyyy-MM-dd') : null,
        is_active: activeSubscriptions?.length ? activeSubscriptions[0].is_active : false,
        plan_price: activeSubscriptions?.length ? activeSubscriptions[0].plan_price : null
      }
    }
    this.utilService.setSpinnerState(true);
    this.developersService.updateDeveloperDetails(payload).subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.utilService.showToastMessage({
            message: res?.message,
            success: true,
          });
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

  cancel() {
    this.router.navigate(['/developers']);
  }

  initiateForm(data?: any) {
    this.clientForm = this.fb.group({
      username: [{value: data?.username || '', disabled: true}],
      firstName: [data?.firstName || ''],
      lastName: [data?.lastName || ''],
      mobile: [data?.mobile || ''],
      email: [data?.email || ''],
      country: [data?.country || ''],
      role: [{value: data?.role || '', disabled: true}],
      brandName: [data?.brandName || ''],
      staff_left_doctor: [0],
      staff_left_nondoctor: [0],
      subscriptions: this.fb.array([]),
    });
    if(data?.subscription && data?.subscription.length) {
      data?.subscription.forEach((element: any) => {
        this.addSubscription(element);
      });
    }
  }

  get subscriptions(): FormArray {
    return this.clientForm.get('subscriptions') as FormArray;
  }

  createElements(data: any): FormGroup {
    return this.fb.group({
      plan_name: [data?.plan_name ? data?.plan_name.charAt(0).toUpperCase() + data?.plan_name.slice(1) : ''],
      plan_price: [data?.plan_price || ''],
      subscription_startDate: [data?.subscription_startDate || ''],
      subscription_endDate: [data?.subscription_endDate || 1],
      is_active: [{value: data?.is_active || false, disabled: !data?.is_active}]
    })
  }

  addSubscription(data?: any) {
    this.subscriptions.push(this.createElements(data))
  }

  removeSubscription(index: number) {
    if (this.subscriptions.length > 1) {
      this.subscriptions.removeAt(index);
    }
  }

  updateStaffLeft(type: string, staffType: string) {
    const currentValue = this.clientForm.get(staffType === 'doctor' ? 'staff_left_doctor' : 'staff_left_nondoctor')?.value || 0;
    if(type === 'plus') {
      this.clientForm.get(staffType === 'doctor' ? 'staff_left_doctor' : 'staff_left_nondoctor')?.setValue(currentValue + 1);
    }
    else if(type === 'minus' && currentValue > 0) {
      this.clientForm.get(staffType === 'doctor' ? 'staff_left_doctor' : 'staff_left_nondoctor')?.setValue(currentValue - 1);
    }
  }

}
