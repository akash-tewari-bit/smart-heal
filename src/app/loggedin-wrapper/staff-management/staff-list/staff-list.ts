import { Component } from '@angular/core';
import { UtilityService } from '../../../shared/services/utility.service';
import { StaffManagementService } from '../staff-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  standalone: false,
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.scss'
})
export class StaffList {
  staffList: any = [];

  constructor(public utilService: UtilityService, public StaffManagementService: StaffManagementService, public router: Router) {}

  ngOnInit() {
    setTimeout(() => { 
      this.getStaff();
    });
  }

  getStaff() {
    this.utilService.setSpinnerState(true);
    this.StaffManagementService.getStaffList().subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.staffList = res?.data;
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

  viewOrEditStaff(item: any) {
    this.router.navigate([`/staff-management/edit/${item.id}`])
  }

  deleteStaff(data: any) {
    const payload = {
      id: data.id
    };
    this.utilService.setSpinnerState(true);
    this.StaffManagementService.deleteStaff(this.utilService.transformObj(payload)).subscribe((res: any) => {
      if(res?.success) {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: res.message,
          success: true,
        });
        this.getStaff();
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
}
