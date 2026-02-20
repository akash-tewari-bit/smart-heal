import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../../shared/services/utility.service';
import { MedicineManagementService } from '../medicine-management.service';

@Component({
  selector: 'app-add-medicine',
  standalone: false,
  templateUrl: './add-medicine.html',
  styleUrl: './add-medicine.scss'
})
export class AddMedicine {
  medicineForm!: FormGroup;
  formSubmitted = false;
  medicineId: any = '';
  medicineDetail: any = '';

  constructor(public fb: FormBuilder, public router: Router, public medicineManagementService: MedicineManagementService, public utilService: UtilityService, public activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.initiateForm();
    this.activatedRoute.paramMap.subscribe(params => {
      this.medicineId = params.get('id');
      if(this.medicineId) {
        setTimeout(() => { 
          this.getMedicineDetails();
        });
      }
    });
  }

  createUpdateMedicine() {
    const form = this.medicineForm.getRawValue();
    this.medicineForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.medicineForm.valid) {
      const payload = {
        medicine_name: form.medicineName,
        composition: form.composition,
        manufacturer: form.manufacturer,
        medicine_id: this.medicineId ?? null
      };
      if(!this.medicineId) delete payload.medicine_id;
      this.utilService.setSpinnerState(true);
      const service = this.medicineId ? this.medicineManagementService.updateMedicine(this.utilService.transformObj(payload)) : this.medicineManagementService.addMedicine(this.utilService.transformObj(payload))
      service.subscribe((res: any) => {
        this.formSubmitted = false;
        if(res?.success) {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res.message,
            success: true,
          });
          this.router.navigate(['/medicine-management']);
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

  getMedicineDetails() {
    this.utilService.setSpinnerState(true);
    this.medicineManagementService.getMedicinesData(this.medicineId).subscribe(
      (res: any) => {
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.medicineDetail = res?.data;
          this.initiateForm();
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
    this.router.navigate(['medicine-management'])
  }

  initiateForm() {
    this.medicineForm = this.fb.group({
      medicineName: [this.medicineDetail?.medicine_name ?? '', [Validators.required]],
      composition: [this.medicineDetail?.composition ?? '', [Validators.required]],
      manufacturer: [this.medicineDetail?.manufacturer ?? '', [Validators.required]]
    })
  }

}

