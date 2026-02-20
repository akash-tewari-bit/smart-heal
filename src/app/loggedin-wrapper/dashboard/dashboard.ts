import { Component } from '@angular/core';
import { UtilityService } from '../../shared/services/utility.service';
import { AppointmentService } from '../appointments/appointment.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PatientsService } from '../patients/patients.service';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { NotificationsService } from '../notification/notifications.service';
import { BillingService } from '../billing/billing.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  configurations: any = JSON.parse(localStorage.getItem('configurations')!);
  appointmentsList: any = []
  paginationConfig = {
    page: 1,
    pageSize: 5,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0
  }
  patientsList: any = [];
  startDate: any = new Date();
  endDate: any = new Date();
  notificationsList: any = [];
  billingSummaryData: any;
  summaryData: any;
  isMobile = window.innerWidth < 768;

  constructor(public appointmentService: AppointmentService, public utilService: UtilityService, public datePipe: DatePipe, public router: Router, public patientService: PatientsService, public notificationsService: NotificationsService, public billingService: BillingService, public dashboardService: DashboardService) {}

  ngOnInit() {
    setTimeout(() => {
      this.getInitialData(true, true, true, true);
    });
  }

  ngAfterContentChecked() {
    this.configurations= JSON.parse(localStorage.getItem('configurations')!);
  }

  getInitialData(summaryData: boolean, notificationCall: boolean, billingCall: boolean, appointmentCall: boolean) {
    // const startDate = new Date();
    this.startDate.setHours(0);
    this.startDate.setMinutes(0);
    this.startDate.setSeconds(0);
    // const endDate = new Date();
    this.endDate.setHours(23);
    this.endDate.setMinutes(59);
    this.endDate.setSeconds(59);
    
    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // const dayOfWeek = startDate.getDay(); 

    // Calculate how many days have passed since Monday
    // const daysSinceMonday = (dayOfWeek + 6) % 7; 

    // Get the date for the most recent Monday
    // const monday = new Date(startDate);
    // monday.setDate(startDate.getDate() - daysSinceMonday);

    // Format as YYYY-MM-DD (optional)
    // const formatDate = (date: any) => date.toISOString().split('T')[0];
    
    
    const apis: { [key: string]: Observable<any> } = {};
    if(summaryData) {
      const obj = {
        startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        // status: 'Upcoming'
      }
      apis['summaryDataList'] = this.handleError(this.dashboardService.getDashboardSummaryCounts(obj), null)
    }
    // if(patientCall) {
    //   const data = {
    //     startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
    //     endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
    //     type: 0
    //   }
    //   apis['patientsList'] = this.handleError(this.patientService.getPatientsList(this.paginationConfig, data), null)
    // }
    if(notificationCall) {
      const obj = {
        startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        status: 'unread',
      };
      apis['notificationList'] = this.handleError(this.notificationsService.getNotificationsList(obj), null)
    }
    if(billingCall) {
      const obj = {
        startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        status: 'unread',
      };
      apis['billingList'] = this.handleError(this.billingService.getBillingSummary(obj), null)
    }
    if(appointmentCall) {
      const obj = {
        startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
        status: 'Upcoming'
      }
      apis['appointmentList'] = this.handleError(this.appointmentService.getAppointmentsList(this.paginationConfig, obj), null)
    }
    this.utilService.setSpinnerState(true);
    forkJoin(apis).subscribe({
      next: (results: any) => {
        this.utilService.setSpinnerState(false);
        if(summaryData) {
          const summaryDataList = results.summaryDataList;
          this.updateSummaryData(summaryDataList);
        }
        // if(patientCall) {
        //   const patientsList = results.patientsList;
        //   this.updatePatientsList(patientsList);
        // }
        if(notificationCall) {
          const notificationList = results.notificationList;
          this.updateNotifications(notificationList); 
        }
        if(billingCall) {
          const billingList = results.billingList;
          this.updateBilling(billingList);
        }
        if(appointmentCall) {
          const appointmentList = results.appointmentList;
          this.updateAppointmentsList(appointmentList);
        }
      },
      error: (err) => {
        this.utilService.setSpinnerState(false);
        // This won't usually get triggered due to catchError inside each call,
        // but include it just in case.
        // console.error('Unexpected error in forkJoin:', err);
      }
    });
  }

  private handleError<T>(obs$: Observable<T>, fallback: T): Observable<T> {
    return obs$.pipe(
      catchError(error => {
        // console.error(`${label} API failed:`, error);
        return of(fallback);
      })
    );
  }

  updateAppointmentsList(list: any) {
    if(list) {
      this.appointmentsList = list?.data?.appointment_list;
      this.paginationConfig.page = list?.data?.page;
      this.paginationConfig.pageSize = list?.data?.page_size;
      this.paginationConfig.totalRecords = list?.data?.total_records;
    }
  }

  updateSummaryData(data: any) {
    if(data) {
      this.summaryData = data?.data;
      // this.paginationConfig.page = list?.data?.page;
      // this.paginationConfig.pageSize = list?.data?.page_size;
      // this.paginationConfig.totalRecords = list?.data?.total_records;
    }
  }

  updatePatientsList(list: any) {
    if(list) {
      this.patientsList = list?.data?.patient_list;
    }
  }

  updateNotifications(list: any) {
    if(list) {
      this.notificationsList = list?.data;
    }
  }

  updateBilling(data: any) {
    this.billingSummaryData = data?.data;
  }

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    this.getInitialData(false, false, false, true);
  }

  appointmentAction(item: any) {
    this.router.navigate(['/appointments', item.appointment_id]);
  }

  addEvent(event: any) {
    if(this.startDate && this.endDate) {
      this.getInitialData(true, true, true, true);
    }
  }

}
