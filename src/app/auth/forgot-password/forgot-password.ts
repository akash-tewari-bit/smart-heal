import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  forgotPasswordForm!: FormGroup;
  validUsername = false;
  validEmail = false;
  passwordChanged = false;
  formSubmitted = false;
  validOtp = false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    public utilService: UtilityService
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      otp: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {}

  validateUser() {
    if (!this.validUsername && !this.validEmail) {
      this.forgotPasswordForm.markAllAsTouched();
      this.formSubmitted = true;
      this.validUsername = false;
      this.validEmail = false;
      if (
        this.forgotPasswordForm.get('username')?.valid &&
        this.forgotPasswordForm.get('email')?.valid
      ) {
        const payload = {
          username: this.forgotPasswordForm.get('username')?.value,
          email: this.forgotPasswordForm.get('email')?.value,
        };
        this.utilService.setSpinnerState(true);

        this.authService.forgotPassword(payload).subscribe(
          (res: any) => {
            this.utilService.setSpinnerState(false);
            if (res.success) {
              this.forgotPasswordForm.markAsUntouched();
              this.formSubmitted = false;
              this.validUsername = true;
              this.validEmail = true;
              this.utilService.showToastMessage({
                message: res.message,
                success: true,
              });
            } else {
              this.utilService.showToastMessage({
                message: res.message,
                success: false,
              });
            }
          },
          (err) => {
            this.utilService.setSpinnerState(false);
          }
        );
      }
    } else {
      this.submitOtp();
    }
  }

  submitOtp() {
    this.forgotPasswordForm.markAllAsTouched();
    this.formSubmitted = true;
    const payload = {
      email: this.forgotPasswordForm.get('email')?.value,
      otp: this.forgotPasswordForm.get('otp')?.value,
    };
    if (this.forgotPasswordForm.get('otp')?.value) {
      this.utilService.setSpinnerState(true);

      this.authService.verifyOtp(payload).subscribe(
        (res: any) => {
          this.utilService.setSpinnerState(false);
          if (res.success) {
            this.forgotPasswordForm.markAsUntouched();
            this.formSubmitted = false;
            this.validOtp = true;
            this.utilService.showToastMessage({
              message: res.message,
              success: true,
            });
          } else {
            this.utilService.showToastMessage({
              message: res.message,
              success: false,
            });
          }
        },
        (err) => {
          this.utilService.setSpinnerState(false);
          // this.utilService.showToastMessage({message: res.message, success: false});
        }
      );
    }
  }

  resetPassword() {
    // this.passwordChanged = false;
    // const form = this.forgotPasswordForm.value;
    // if(form.newPassword === form.confirmPassword) {
    //   this.passwordChanged = true;
    // }

    this.forgotPasswordForm.markAllAsTouched();
    this.formSubmitted = true;
    const payload = {
      email: this.forgotPasswordForm.get('email')?.value,
      new_password: this.forgotPasswordForm.get('newPassword')?.value,
    };
    if (
      this.forgotPasswordForm.get('newPassword')?.value &&
      this.forgotPasswordForm.get('confirmPassword')?.value
    ) {
      if (
        this.forgotPasswordForm.get('newPassword')?.value ===
        this.forgotPasswordForm.get('confirmPassword')?.value
      ) {
        this.utilService.setSpinnerState(true);

        this.authService.resetPassword(payload).subscribe(
          (res: any) => {
            this.utilService.setSpinnerState(false);
            if (res.success) {
              this.utilService.showToastMessage({
                message: res.message,
                success: true,
              });
              this.forgotPasswordForm.markAsUntouched();
              this.formSubmitted = false;
              this.router.navigate(['auth/login']);
            } else {
              this.utilService.showToastMessage({
                message: res.message,
                success: false,
              });
            }
          },
          (err) => {
            this.utilService.setSpinnerState(false);
            // this.utilService.showToastMessage({message: res.message, success: false});
          }
        );
      } else {
        this.utilService.showToastMessage({
          message: 'New password and confirm password must be same.',
          success: false,
        });
      }
    }
  }

  resetPasswordPopUpClosed() {
    // this.router.navigate(['/auth/login']);
  }
}
