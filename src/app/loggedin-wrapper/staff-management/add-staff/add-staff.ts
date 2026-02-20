import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffManagementService } from '../staff-management.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-add-staff',
  standalone: false,
  templateUrl: './add-staff.html',
  styleUrl: './add-staff.scss'
})
export class AddStaff {
  staffForm!: FormGroup;
  formSubmitted = false;
  staffId: any = '';
  staffDetail: any = '';
  staffLeft: any = 0;
  
  constructor(public fb: FormBuilder, public router: Router, public staffManagementService: StaffManagementService, public utilService: UtilityService, public activatedRoute: ActivatedRoute) {
  }
  
  ngAfterContentChecked() {
    this.staffLeft = this.utilService.configurations?.staff_left ?? 0;
  }

  ngOnInit() {
    this.initiateForm();
    this.activatedRoute.paramMap.subscribe(params => {
      this.staffId = params.get('id');
      if(this.staffId) {
        setTimeout(() => { 
          this.getStaffDetails();
        });
      }
    });
  }

  createStaff() {
    const form = this.staffForm.getRawValue();
    this.staffForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.staffForm.valid) {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        country: form.country,
        mobile: form.mobile,
        role: form.role,
        username: form.username,
        password: form.password,
        sendToEmail: form.sendToEmail,
        id: ''
      };
      if(this.staffId) payload.id = this.staffId
      this.utilService.setSpinnerState(true);
      const service = this.staffId ? this.staffManagementService.updateStaff(this.utilService.transformObj(payload)) : this.staffManagementService.addStaff(this.utilService.transformObj(payload))
      service.subscribe((res: any) => {
        this.formSubmitted = false;
        if(res?.success) {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res.message,
            success: true,
          });
          this.router.navigate(['/staff-management']);
          this.staffManagementService.notifyStaffCountUpdate(true);
        }
        else {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res.message,
            success: false,
          });
        }
      }, err => {
        this.formSubmitted = false;
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err.error.message,
          success: false,
        });
      })
    }
  }

  getStaffDetails() {
    this.utilService.setSpinnerState(true);
    this.staffManagementService.getStaffDetails(this.staffId).subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.staffDetail = res?.data;
          this.initiateForm();
          this.staffForm.disable();
          this.staffForm.get('country')?.enable();
          this.staffForm.get('mobile')?.enable();
          this.staffForm.get('role')?.enable();
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

  cancel() {
    this.router.navigate(['staff-management'])
  }

  initiateForm() {
    this.staffForm = this.fb.group({
      firstName: [this.staffDetail?.firstName ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: [this.staffDetail?.lastName ?? ''],
      email: [this.staffDetail?.email ?? '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)]],
      country: [this.staffDetail?.country ?? '', Validators.required],
      mobile: [this.staffDetail?.mobile ?? '', [Validators.required, Validators.minLength(5)]],
      role: [this.staffDetail?.role ?? '', [Validators.required]],
      username: [this.staffDetail?.username ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(18), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9._-]{2,19}$/)]],
      password: [this.staffDetail?.password ?? '', [Validators.required, Validators.minLength(6)]],
      sendToEmail: [this.staffDetail?.sendToEmail ?? true, [Validators.required]],
    })
  }

}
