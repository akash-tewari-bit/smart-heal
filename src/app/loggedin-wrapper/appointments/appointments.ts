import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { AppointmentService } from './appointment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments {
  appointmentsList: any = [];
  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  paginationConfig = {
    page: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0,
  };
  appointmentsLeft: any = 0
  noAppointmentSchedulingText1: any;
  noAppointmentSchedulingText2: any;
  isMobile = window.innerWidth < 768;

  constructor(
    public router: Router,
    public utilService: UtilityService,
    public appointmentService: AppointmentService,
    public datePipe: DatePipe
  ) {}

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

  appointmentAction(item: any) {
    this.router.navigate(['/appointments', item.appointment_id]);
  }

  getAppointmentsList(data?: any) {
    this.utilService.setSpinnerState(true);
    this.appointmentService
      .getAppointmentsList(this.paginationConfig, data)
      .subscribe(
        (res: any) => {
          this.utilService.setSpinnerState(false);
          if (res?.success) {
            this.appointmentsList = res?.data?.appointment_list;
            this.appointmentsList?.forEach((e: any) => {
              if (e?.paymentDetails?.length) {
                e['consolidatedPaymentDetails'] = [];
                let obj: any = {};
                e.paymentDetails.forEach((ev: any) => {
                  if (obj[ev.type]) {
                    obj[ev.type] += ev.amount;
                  } else {
                    obj[ev.type] = ev.amount;
                  }
                });
                e['consolidatedPaymentDetails'] = Object.entries(obj).map(
                  ([type, amount]) => ({
                    type,
                    amount,
                  })
                );
              }
            });
            this.paginationConfig.page = res?.data?.page;
            this.paginationConfig.pageSize = res?.data?.page_size;
            this.paginationConfig.totalRecords = res?.data?.total_records;
          } else {
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

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    this.getAppointmentsList();
  }

  updateRecords(data: any) {
    this.paginationConfig.page = 1;
    this.paginationConfig.pageSize = 10;
    this.appointmentsList = [];
    this.getAppointmentsList(data);
  }
}
