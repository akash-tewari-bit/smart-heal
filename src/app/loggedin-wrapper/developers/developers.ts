import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DevelopersService } from './developers.service';
import { UtilityService } from '../../shared/services/utility.service';

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
  clientList: any = [
    // {
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
    // }
  ];

  constructor(public router: Router, public developersService: DevelopersService, public utilService: UtilityService) {}

  ngOnInit() {
    setTimeout(() => {
      this.getClientsList();
    }
    );
  }

  showClientDetail(item: any) {
    this.router.navigate(['/developers/view-edit', item?.id]);
  }

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    // this.getPatientsList();
  }

  getClientsList() {
    this.utilService.setSpinnerState(true);
    this.developersService.getDevelopersList().subscribe((res: any) => {
      if(res?.success) {
        this.utilService.setSpinnerState(false);
        this.clientList = res?.data;
        // this.paginationConfig.totalRecords = res?.data?.total_records;
      }
      else {
        this.utilService.setSpinnerState(false);
      }
    }, err => {
      this.utilService.setSpinnerState(false);
    });
  }

}
