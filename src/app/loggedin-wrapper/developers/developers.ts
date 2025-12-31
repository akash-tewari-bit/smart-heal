import { Component } from '@angular/core';

@Component({
  selector: 'app-developers',
  standalone: false,
  templateUrl: './developers.html',
  styleUrl: './developers.scss'
})
export class Developers {
  paginationConfig = {
    page: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0
  }
  ClientList: any = [
    {
      firstName: 'Stone',
      lastName: 'Cold',
      brandName: 'S Dental Clinic',
      subscription: 'Basic Plan',
      expiry: '12/30/2025',
    }
  ];



  showClientDetail(item: any) {

  }

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    // this.getPatientsList();
  }

}
