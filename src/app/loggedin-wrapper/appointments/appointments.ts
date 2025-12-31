import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { AppointmentService } from './appointment.service';

@Component({
  selector: 'app-appointments',
  standalone: false,
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments {
  // appointments: any = [
  //   {
  //     id: 1,
  //     firstName: 'Paul',
  //     lastName: 'Richard',
  //     date: 'Nov 20, 2025',
  //     time: '10:00 AM',
  //     age: 20,
  //     email: 'test@example.com',
  //     mobile: '987654321',
  //     reason: 'New Patient',
  //     lastVisit: 'Nov 10, 2024',
  //     weight: '58 kgs',
  //     temperature: '98',
  //     bloodPressure: '120 / 80',
  //     gender: 'Male',
  //     address: 'Gurugram, Haryana',
  //     bloodGroup: 'B+',
  //     status: 1,
  //   },
  //   {
  //     id: 2,
  //     firstName: 'Anil',
  //     lastName: 'Agarwal',
  //     date: 'Nov 20, 2025',
  //     time: '01:00 PM',
  //     age: 20,
  //     email: 'test@example.com',
  //     mobile: '987654321',
  //     reason: 'Follow-up',
  //     lastVisit: 'Nov 10, 2024',
  //     weight: '58 kgs',
  //     temperature: '98',
  //     bloodPressure: '120 / 80',
  //     gender: 'Male',
  //     address: 'Gurugram, Haryana',
  //     bloodGroup: 'B+',
  //     status: 0,
  //   },
  //   {
  //     id: 3,
  //     firstName: 'Ravi',
  //     lastName: 'Sahota',
  //     date: 'Nov 20, 2025',
  //     time: '10:00 AM',
  //     age: 20,
  //     email: 'test@example.com',
  //     mobile: '987654321',
  //     reason: 'New Patient',
  //     lastVisit: 'Nov 10, 2024',
  //     weight: '58 kgs',
  //     temperature: '98',
  //     bloodPressure: '120 / 80',
  //     gender: 'Male',
  //     address: 'Gurugram, Haryana',
  //     bloodGroup: 'B+',
  //     status: 1,
  //   },
  //   {
  //     id: 4,
  //     firstName: 'Anil',
  //     lastName: 'Agarwal',
  //     date: 'Nov 20, 2025',
  //     time: '01:00 PM',
  //     age: 20,
  //     email: 'test@example.com',
  //     mobile: '987654321',
  //     reason: 'Follow-up',
  //     lastVisit: 'Nov 10, 2024',
  //     weight: '58 kgs',
  //     temperature: '98',
  //     bloodPressure: '120 / 80',
  //     gender: 'Male',
  //     address: 'Gurugram, Haryana',
  //     bloodGroup: 'B+',
  //     status: 0,
  //   },
  // ];
  appointmentsList: any = [];
  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  paginationConfig = {
    page: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0,
  };

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
  // };

  constructor(
    public router: Router,
    public utilService: UtilityService,
    public appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.getAppointmentsList();
    });
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
