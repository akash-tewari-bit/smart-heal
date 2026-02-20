import { Component, Input } from '@angular/core';
import { SettingsService } from '../settings.service';
import { UtilityService } from '../../../shared/services/utility.service';

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

  constructor(public settingsService: SettingsService, public utilService: UtilityService) {}

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
    this.closeModal();
    setTimeout(() => { 
      this.showQueryForm = true;
    });
  }

  submitQuery(event: any) {
    const payload = {
      plan_id: this.selectedPlan?.id
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
    // this.utilService.setSpinnerState(true);
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
}
