import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { MedicineManagementService } from './medicine-management.service';

@Component({
  selector: 'app-medicine-management',
  standalone: false,
  templateUrl: './medicine-management.html',
  styleUrl: './medicine-management.scss'
})
export class MedicineManagement {

  medicineList: any = [];
  text: any = '';
  paginationConfig = {
    page: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15, 20],
    hidePageSizeOption: true,
    totalRecords: 0,
  };

  constructor(public utilService: UtilityService, public medicineManagementService: MedicineManagementService, public router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.getMedicineList();
    });
  }

  getMedicineList() {
    const payload = {
      searchText: this.text?.trim() || ''
    };
    this.utilService.setSpinnerState(true);
    this.medicineManagementService.getMedicinesList(this.paginationConfig, payload).subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if (res?.success) {
          this.medicineList = res?.data?.medicines_list;
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

  editMedicine(item: any) {
    this.router.navigate([`/medicine-management/edit-medicine/${item.medicine_id}`])
  }

  deleteMedicine(data: any) {
    const payload = {
      ids_to_delete: [data.medicine_id.toString()]
    };
    this.utilService.setSpinnerState(true);
    this.medicineManagementService.deleteMedicine(this.utilService.transformObj(payload)).subscribe((res: any) => {
      if (res?.success) {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: res.message,
          success: true,
        });
        this.getMedicineList();
      }
      else {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: res.message,
          success: false,
        });
      }
    }, err => {
      this.utilService.setSpinnerState(false);
      this.utilService.showToastMessage({
        message: err.error.message,
        success: false,
      });
    })
  }

  handlePageEvent(event: any) {
    this.paginationConfig.page = event.pageIndex + 1;
    this.getMedicineList();
  }

  updateRecords() {
    this.paginationConfig.page = 1;
    this.paginationConfig.pageSize = 10;
    this.getMedicineList();
  }

  resetRecords() {
    this.text = '';
    this.getMedicineList();
  }
}

