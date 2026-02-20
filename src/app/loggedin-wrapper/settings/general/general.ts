import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-general',
  standalone: false,
  templateUrl: './general.html',
  styleUrl: './general.scss'
})
export class General {
  // userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);
  generalSettingsForm!: FormGroup;
  selectedFile: any = '';
  @Input() configurations: any;
  imageUrl: any = '';

  constructor(public fb: FormBuilder, public settingsService: SettingsService, public utilService: UtilityService) {}

  ngOnInit() {
    this.generalSettingsForm = this.fb.group({
      mobile: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    })
  }

  ngOnChanges() {
    if(this.configurations) this.setData();
  }

  saveChanges() {
    const form = this.generalSettingsForm.value
    const formData = new FormData();
    formData.append('image', this.selectedFile ?? '');       // file
    formData.append('mobile', form.mobile ?? '');              // simple string
    formData.append('current_password', form.currentPassword ?? '');
    formData.append('password', form.password ?? '');
    // const payload = {
    //   mobile: form.mobile,
    //   current_password: form.currentPassword,
    //   password: form.newPassword
    // }
    if(form.currentPassword && form.newPassword && form.confirmPassword && (form.newPassword !== form.confirmPassword)) {
      this.utilService.showToastMessage({
        message: 'New password and confirm password must be same.',
        success: false,
      });
    }
    if (form.mobile || (form.currentPassword && form.newPassword && form.confirmPassword && (form.newPassword === form.confirmPassword))) {
      this.utilService.setSpinnerState(true);
      this.settingsService.updateGeneralSettings(formData).subscribe((res: any) => {
        if(res?.success) {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res?.message,
            success: true,
          });
        }
        else {
          this.utilService.setSpinnerState(false);
          this.utilService.showToastMessage({
            message: res?.message,
            success: false,
          });
        }
      }, err => {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err?.error?.message,
          success: false,
        });
      })
    }
  }

  uploadImage(fileInput: HTMLInputElement): void {
    fileInput.click(); // Programmatically triggers the file input
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  setData() {
    this.generalSettingsForm.get('mobile')?.setValue(this.configurations?.general?.mobile)
    this.imageUrl = this.configurations?.general?.profile_image_url ?? '';
  }

}
