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
  billingList: any = [];
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
  hasSelectedBilling: any[] = [];
  exportList: any = [];

  constructor(public billingService: BillingService, public utilService: UtilityService, public datePipe: DatePipe) { }

  ngOnInit() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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
    if(data?.action === 'delete') {
      this.deleteBilling();
      return;
    }
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
    if (summary) {
      apis['summary'] = this.handleError(this.billingService.getBillingSummary(obj), null)
    }
    if (list) {
      apis['list'] = this.handleError(this.billingService.getBillingDetails(this.paginationConfig, obj), null)
    }
    this.utilService.setSpinnerState(true);
    forkJoin(apis).subscribe({
      next: (results: any) => {
        this.utilService.setSpinnerState(false);
        if (summary) {
          const summaryData = results.summary;
          this.updateSummaryData(summaryData);
        }
        if (list) {
          const billingList = results.list;
          this.updateBillingDetails(billingList);
        }
      },
      error: (err) => {
        this.utilService.setSpinnerState(false);
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
    if (this.startDate && this.endDate) {
      this.getInitialData(true, true);
    }
  }

  updateSelectedBilling(event: any, item: any) {
    if (event?.target?.checked) {
      if (!this.hasSelectedBilling.some((selected: any) => selected.billing_id === item.billing_id)) {
        this.hasSelectedBilling.push(item);
      }
    } else {
      this.hasSelectedBilling = this.hasSelectedBilling.filter((selected: any) => selected.billing_id !== item.billing_id);
    }
  }

  downloadReport() {
    this.utilService.setSpinnerState(true);
    const obj = {
      startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd'),
      type: null
    }
    this.billingService.getBillingDetails(null, obj).subscribe((res: any) => {
      if (res?.success) {
        this.utilService.setSpinnerState(false);
        this.exportList = res?.data?.billing_list;
        this.exportToCSV();
      } else {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: 'Failed to fetch billing data for export',
          success: false
        });
      }
    }, err => {
      this.utilService.setSpinnerState(false);
      this.utilService.showToastMessage({
        message: 'Failed to fetch billing data for export',
        success: false
      });
    });
  }

  private exportToCSV() {
    if (this.exportList.length === 0) {
      this.utilService.showToastMessage({
        message: 'No data to download',
        success: false
      });
      return;
    }

    // Convert data to CSV
    const csvContent = this.convertToCSV(this.exportList);
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `Billing_Report_${this.datePipe.transform(this.startDate, 'yyyy-MM-dd')}_${this.datePipe.transform(this.endDate, 'yyyy-MM-dd')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    // Define custom headers
    const headerLabels = ['Patient Name', 'Date', 'Type', 'Amount'];
    
    // Create header row
    const csvHeader = headerLabels.join(',');
    
    // Create data rows
    const csvRows = data.map((item: any) => {
      const values = [
        `${item.firstName || ''} ${item.lastName || ''}`.trim(),
        item.billingDate || '',
        item.billingType || '',
        item.amount || ''
      ];

      return values.map((value: string) => {
        if (value === null || value === undefined || value === '') return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    return [csvHeader, ...csvRows].join('\n');
  }

  deleteBilling() {
    this.billingService.deletePaymentBilling({ ids_to_delete: this.hasSelectedBilling.map(item => item.billing_id) }).subscribe((res: any) => {
      this.utilService.showToastMessage({
        message: 'Selected billing records deleted successfully',
        success: true
      });
      this.hasSelectedBilling = [];
      this.getInitialData(true, true);
    }, err => {
      this.utilService.showToastMessage({
        message: 'Failed to delete selected billing records',
        success: false
      });
    })
  }
}
