import { Component } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { UtilityService } from '../../shared/services/utility.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  standalone: false,
  templateUrl: './subscription.html',
  styleUrl: './subscription.scss'
})
export class Subscription {
  planDetails: any = [];
    showPlans = false;
    showQueryForm = false;
    showConfirmationText = false;
    disablePrimaryButton = false;
    selectedPlan: any = '';
    plans: any = [];
    querySubmittedRes: any = '';
    activeplan: any;
    monthSelected = 1;
    UpdatedPrice: any;
    startDate: Date | null = null;
    endDate: Date | null = null;
    customForm!: FormGroup
    formSubmitted = false;
  
    constructor(public settingsService: SettingsService, public utilService: UtilityService, public datePipe: DatePipe, public fb: FormBuilder) {
      this.customForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        company_name: [''],
        message: ['', Validators.required],
      });
    }
  
    ngOnInit() {
      this.billingHistory();
      this.getPlans();
    }
  
    view(item: any) {
  
    }
  
    showPlansData() {
      this.showPlans = true;
    }
  
    closeModal(event?: any) {
      this.showPlans = false;
      this.showQueryForm = false;
    }
  
    queryForm(item: any) {
      this.selectedPlan = item;
      this.updateAmount({target: {value: this.monthSelected}});
      this.closeModal();
      setTimeout(() => { 
        this.customForm.reset();
        this.showQueryForm = true;
      });
    }
  
    submitQuery(event?: any) {
      const payload: any = {
        plan_id: this.selectedPlan?.id,
        startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd')
      }
      if(this.selectedPlan?.name === 'custom') {
        payload.startDate = null;
        payload.endDate = null;
        payload['name'] = this.customForm.get('name')?.value ?? null;
        payload['email'] = this.customForm.get('email')?.value ?? null;
        payload['company_name'] = this.customForm.get('company_name')?.value ?? null;
        payload['message'] = this.customForm.get('message')?.value ?? null;
      }
      this.utilService.setSpinnerState(true);
      this.settingsService.subscribe(payload).subscribe((res: any) => {
        if(res?.success) {
          this.querySubmittedRes = res;
          this.utilService.setSpinnerState(false);
          this.showConfirmationText = true;
          this.disablePrimaryButton = true;
          setTimeout(() => {
            this.showConfirmationText = false;
            this.disablePrimaryButton = false;
            this.closeModal();
          }, 5000);
        }
        else {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res?.message,
            success: false
          })
        }
      }, err => {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err?.error?.message,
          success: false
        })
      })
    }
  
    getPlans() {
      this.utilService.setSpinnerState(true);
      this.settingsService.getPlans().subscribe((res: any) => {
        if(res?.success) {
          this.utilService.setSpinnerState(false);
          this.plans = res?.data;
        }
        else {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res?.message,
            success: false
          })
        }
      }, err => {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err?.error?.message,
          success: false
        })
      })
    }
  
    billingHistory() {
      this.utilService.setSpinnerState(true);
      this.settingsService.getBillingHistory().subscribe((res: any) => {
        if(res?.success) {
          this.utilService.setSpinnerState(false);
          this.planDetails = res?.data;
          if(this.planDetails?.length) this.activeplan = (this.planDetails.filter((e: any) => e.is_active))[0];
        }
        else {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res?.message,
            success: false
          })
        }
      }, err => {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err?.error?.message,
          success: false
        })
      })
    }

    updateAmount(event: any) {
      this.UpdatedPrice = 0;
      this.monthSelected = event?.target?.value;
      if(this.monthSelected && this.selectedPlan) {
        this.UpdatedPrice = this.selectedPlan?.price * this.monthSelected;
        this.startDate = new Date();
        this.endDate = new Date();
        this.endDate.setMonth(this.endDate.getMonth() + Number(this.monthSelected));
        this.endDate.setDate(this.endDate.getDate() - 1);
      }
    }

}
