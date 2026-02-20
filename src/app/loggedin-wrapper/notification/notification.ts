import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { NotificationsService } from './notifications.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.html',
  styleUrl: './notification.scss'
})
export class Notification {
  notificationList: any = [];

  paginationConfig = {
    page: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0
  }

  constructor(public router: Router, public utilService: UtilityService, public notificationsService: NotificationsService, public datePipe: DatePipe) {}

  ngOnInit() {
    setTimeout(() => { 
      this.getNotifications();
    });
  }

  viewNotification(item: any) {
    if(item?.type == 'appointment' || item?.type == 'payment') {
      this.markAllAsRead(false, item);
    }
  }

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    // this.getAppointmentsList();
  }

  getNotifications() {
    const obj = {
      startDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      status: '',
    };
    this.notificationsService
      .getNotificationsList(obj)
      .subscribe((res: any) => {
        if (res?.success) {
          this.notificationList = res?.data;
        }
      });
  }

  markAllAsRead(all = false, item?: any) {
    if(!item || !item?.read) {
      const payload: any = {
        mark_all_as_read: all,
        id: item ? [item?.id] : [],
      };
      this.utilService.setSpinnerState(true);
      this.notificationsService
        .markNotificationAsRead(this.utilService.transformObj(payload))
        .subscribe(
          (res: any) => {
            if (res?.success) {
              this.utilService.setSpinnerState(false);
              this.utilService.showToastMessage({
                message: res.message,
                success: true,
              });
              if (item)
                this.router.navigate(['/appointments', item.appointment_id]);
            } else {
              this.utilService.setSpinnerState(false);
              this.utilService.showToastMessage({
                message: res.message,
                success: false,
              });
            }
          },
          (err) => {
            this.utilService.setSpinnerState(false);
            this.utilService.showToastMessage({
              message: err?.error?.message,
              success: false,
            });
          }
        );
    }
    else {
      if (item) this.router.navigate(['/appointments', item.appointment_id]);
    }
  }

}
