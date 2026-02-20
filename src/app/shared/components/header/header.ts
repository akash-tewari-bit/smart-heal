import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { NotificationsService } from '../../../loggedin-wrapper/notification/notifications.service';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../../../loggedin-wrapper/settings/settings.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  // notificationCount: number = 8;
  isMobile = window.innerWidth < 768;
  text: any = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  notificationList: any = [];
  searchList: any = [];
  showSearchSection = false;
  @ViewChild('searchWrapper') searchWrapperRef!: ElementRef;
  notificationIntervalSession: any = null;
  configurations: any;

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobile = window.innerWidth < 768; // Consider 768px as the breakpoint for mobile
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null) {
    if (!target) return;

    // Cast to HTMLElement only after null check
    const clickedElement = target as HTMLElement;
    if (!this.searchWrapperRef?.nativeElement.contains(clickedElement)) {
      this.showSearchSection = false;
    }
  }

  constructor(
    public router: Router,
    public utilService: UtilityService,
    public notificationsService: NotificationsService,
    public datePipe: DatePipe,
    public settingsService: SettingsService
  ) {}

  ngOnInit() {
    setTimeout(() => { 
      this.getNotifications();
      this.upiConfiguration();
    });
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim() === '') {
            return of([]); // return empty if input is blank
          }
          return this.utilService.search(query).pipe(
            catchError((err) => {
              // console.error('Search failed:', err);
              return of([]); // fallback in case of error
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((results: any) => {
        this.searchList = results?.data;
        this.showSearchSection = true;
      });
    this.onResize();
  }

  logout() {
    this.utilService.setSpinnerState(true);
    setTimeout(() => {
      this.utilService.setSpinnerState(false);
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }, 500);
  }

  viewAllNotifications() {
    this.router.navigate(['/notifications']);
  }

  viewNotification(item: any) {
    if (item?.type == 'appointment' || item?.type == 'payment') {
      this.markAllAsRead(false, item);
    }
  }

  onSearchChange(value: string): void {
    this.showSearchSection = true;
    this.searchSubject.next(value);
  }

  goToRoute(item: any) {
    if (item?.type == 'patient') {
      this.showSearchSection = false;
      this.text = '';
      this.router.navigate(['/patients', item.id]);
    } else {
      this.showSearchSection = false;
      this.text = '';
      this.router.navigate(['/staff-management/edit', item.id]);
    }
  }

  getNotifications() {
    this.notificationCall();
    this.notificationIntervalSession = setInterval(() => {
      this.notificationCall();
    }, 30000);
  }

  notificationCall() {
    const obj = {
      startDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      status: 'unread',
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
            this.getNotifications();
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

  ngOnDestroy(): void {
    if (this.notificationIntervalSession) {
      clearInterval(this.notificationIntervalSession);
      this.notificationIntervalSession = null;
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  upiConfiguration() {
    this.utilService.setSpinnerState(true);
    this.settingsService.getConfiguration().subscribe(
      (res: any) => {
        if(res?.success) {
          this.utilService.setSpinnerState(false);
          this.configurations = res?.data;
          // if(this.configurations.subscription.appointment_left < 0) {
          //   this.configurations.subscription.appointment_left = -1;
          // }
          // this.configurations.subscription.appointment_left = 0;
          // this.configurations.subscription.end_date = '2026-01-25';
          if(this.configurations.subscription.appointment_left === -1) {
            this.configurations.subscription.appointment_left = 'Unlimited';
          }
          this.utilService.setConfigurations(this.configurations);
          localStorage.setItem('configurations', JSON.stringify(this.configurations));
        }
        else {
          this.utilService.setSpinnerState(false);
        }
      },
      (err: any) => {
        this.utilService.setSpinnerState(false);
      }
    );
  }
}
