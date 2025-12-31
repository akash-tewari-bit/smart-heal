import { Component } from '@angular/core';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { BillingService } from './billing.service';
import { UtilityService } from '../../shared/services/utility.service';
import { DatePipe } from '@angular/common';
import { catchError, forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-billing',
  standalone: false,
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing {
  upi = 30;
  cash = 70;
  billingList: any = [
    // {
    //   firstName: 'Akash',
    //   lastName: 'Tewari',
    //   date: '12/30/2025',
    //   staffName: 'Sam',
    //   paymentType: 'UPI',
    //   amount: 500,
    // },
    // {
    //   firstName: 'Sam',
    //   lastName: 'Paul',
    //   date: '12/30/2025',
    //   staffName: 'Sam',
    //   paymentType: 'Cash',
    //   amount: 500,
    // },
    // {
    //   firstName: 'Stone',
    //   lastName: 'Cold',
    //   date: '12/30/2025',
    //   staffName: 'Sam',
    //   paymentType: 'UPI',
    //   amount: 500,
    // },
  ];
  paginationConfig = {
    page: 1,
    pageSize: 5,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0,
  };
  startDate: any;
  endDate: any;
  summaryData: any;
  chartInstance: Chart | undefined;

  constructor(public billingService: BillingService, public utilService: UtilityService, public datePipe: DatePipe) {}

  ngOnInit() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = new Date(today.getFullYear(), today.getMonth()+1, 0);
    setTimeout(() => { 
      this.getInitialData(true, true);
    });
  }

  initializeChart() {
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.chartInstance = new Chart("billingDonutChart", {
      type: 'doughnut',
      data: {
        labels: this.summaryData?.paymentDetails.map((item: any) => item.type),
        datasets: [{
          data: this.summaryData?.paymentDetails.map((item: any) => item.hasOwnProperty('total') && (item.total > -1) ? item.total : []),
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    this.getInitialData(false, true);
  }

  updateRecords(data: any) {
    this.paginationConfig.page = 1;
    this.paginationConfig.pageSize = 10;
    this.billingList = [];
    this.getInitialData(false, true, data);
  }

  updateBillingDetails(data?: any) {
    this.billingList = data?.data?.billing_list;
    this.paginationConfig.page = data?.data?.page;
    this.paginationConfig.pageSize = data?.data?.page_size;
    this.paginationConfig.totalRecords = data?.data?.total_records;
  }

  getInitialData(summary: boolean, list: boolean, event?: any) {
      const obj = {
      startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
      type: event?.paymentType ?? null
    }
      const apis: { [key: string]: Observable<any> } = {};
      if(summary) {
        apis['summary'] = this.handleError(this.billingService.getBillingSummary(obj), null)
      }
      if(list) {
        apis['list'] = this.handleError(this.billingService.getBillingDetails(this.paginationConfig, obj), null)
      }
      this.utilService.setSpinnerState(true);
      forkJoin(apis).subscribe({
        next: (results: any) => {
          this.utilService.setSpinnerState(false);
          if(summary) {
            const summaryData = results.summary;
            this.updateSummaryData(summaryData);
          }
          if(list) {
            const billingList = results.list;
            this.updateBillingDetails(billingList);
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

      updateSummaryData(summaryData: any) {
        this.summaryData = summaryData?.data;
        this.initializeChart();
      }

      addEvent(event: any) {
        if(this.startDate && this.endDate) {
          this.getInitialData(true, true);
        }
      }
}
