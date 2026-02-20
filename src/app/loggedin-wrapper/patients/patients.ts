import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { PatientsService } from './patients.service';

@Component({
  selector: 'app-patients',
  standalone: false,
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class Patients {
  patientsList: any = [];
  paginationConfig = {
    page: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0
  }

  constructor(public router: Router, public utilService: UtilityService, public patientService: PatientsService) {

  }

  ngOnInit() {
  }

  showPatientDetails(item: any) {
    this.router.navigate(['/patients', item.patient_id])
  }

  getPatientsList(data?: any) {
    this.utilService.setSpinnerState(true);
    this.patientService.getPatientsList(this.paginationConfig, data).subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.patientsList = res?.data?.patient_list;
          this.paginationConfig.page = res?.data?.page;
          this.paginationConfig.pageSize = res?.data?.page_size;
          this.paginationConfig.totalRecords = res?.data?.total_records;
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

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    this.getPatientsList();
  }

  updateRecords(data: any) {
    this.paginationConfig.page = 1;
    this.paginationConfig.pageSize = 10;
    this.patientsList = [];
    this.getPatientsList(data);
  }

}
