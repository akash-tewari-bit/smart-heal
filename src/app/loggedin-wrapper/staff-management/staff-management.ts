import { Component } from '@angular/core';
import { UtilityService } from '../../shared/services/utility.service';
import { StaffManagementService } from './staff-management.service';

@Component({
  selector: 'app-staff-management',
  standalone: false,
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss'
})
export class StaffManagement {
  staffLeft = 0;
  staffLeft_Doctor: any = 0;
  staffLeft_NonDoctor: any = 0;
  configurations: any = JSON.parse(localStorage.getItem('configurations')!);

  constructor(public utilService: UtilityService, public StaffManagementService: StaffManagementService) {
    // this.StaffManagementService.updateStaffCount.subscribe((data: any) => {
    //   if (data) {
    //     this.utilService.settingsService.getConfiguration().subscribe(
    //       (res: any) => {
    //         if (res?.success) {
    //           this.utilService.configurations = res?.data;
    //           if (this.utilService.configurations.subscription.appointment_left === -1) {
    //             this.utilService.configurations.subscription.appointment_left = 'Unlimited';
    //           }
    //           this.utilService.setConfigurations(this.utilService.configurations);
    //           localStorage.setItem('configurations', JSON.stringify(this.utilService.configurations));
    //           this.staffLeft = this.utilService.configurations?.staff_left ?? 0;
    //         }
    //       }
    //     );
    //   }
    // });
  }

  ngAfterViewChecked() {
    this.staffLeft_Doctor = JSON.parse(localStorage.getItem('staffLeft_Doctor')!) ?? 0;
    this.staffLeft_NonDoctor = JSON.parse(localStorage.getItem('staffLeft_NonDoctor')!) ?? 0;
    this.staffLeft = this.staffLeft_Doctor + this.staffLeft_NonDoctor;
  }

}
