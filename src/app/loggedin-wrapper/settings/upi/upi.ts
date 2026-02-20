import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '../../../shared/services/utility.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-upi',
  standalone: false,
  templateUrl: './upi.html',
  styleUrl: './upi.scss'
})
export class UPI {
  upiForm!: FormGroup;
  @Input() configurations: any;
  currencies = [
  // { code: 'USD', name: 'United States Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  // { code: 'EUR', name: 'Euro' },
  // { code: 'GBP', name: 'British Pound' },
  // { code: 'JPY', name: 'Japanese Yen' },
];
formSubmitted = false;

constructor(public fb: FormBuilder, public utilService: UtilityService, public settingsService: SettingsService) {
  this.upiForm = this.fb.group({
    upi_id: ['', Validators.required],
    name: ['', Validators.required],
    currency: ['INR', Validators.required]
  })
}

ngOnChanges() {
  if(this.configurations) this.upiConfiguration();
}

submit() {
  const form = this.upiForm.getRawValue();
    this.upiForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.upiForm.valid) {
      this.utilService.setSpinnerState(true);
      this.settingsService.updateUPISettings(this.utilService.transformObj(form)).subscribe(
        (res: any) => {
          if (res?.success) {
            this.formSubmitted = false;
            this.utilService.setSpinnerState(false);
            this.utilService.showToastMessage({
              message: res.message,
              success: true,
            });
          } else {
            this.formSubmitted = false;
            this.utilService.setSpinnerState(false);
            this.utilService.showToastMessage({
              message: res.message,
              success: false,
            });
          }
        },
        (err) => {
          this.formSubmitted = false;
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: err?.error?.message,
            success: false,
          });
        }
      );
    }
}

upiConfiguration() {
  this.upiForm.get('upi_id')?.setValue(this.configurations?.upi?.upi_id);
  this.upiForm.get('name')?.setValue(this.configurations?.upi?.name);
  this.upiForm.get('currency')?.setValue(this.configurations?.upi?.currency);
  if(!this.configurations || !this.configurations?.upi?.currency) {
    this.upiForm.get('currency')?.setValue('INR')
  }
}

}
