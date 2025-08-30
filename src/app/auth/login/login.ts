import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilityService } from '../../shared/services/utility.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  formSubmitted = false;

  constructor(public fb: FormBuilder, public router: Router, public utilService: UtilityService, public authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.loginForm.markAllAsTouched();
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const form = this.loginForm.value
      this.utilService.setSpinnerState(true);
      this.authService.login(form).subscribe((res: any) => {
        this.formSubmitted = false;
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.utilService.showToastMessage({message: res.message, success: true});
          localStorage.setItem('userDetails', JSON.stringify({...res.data?.user_details,...{access_token: res?.data?.access_token}}))
          localStorage.setItem('token', JSON.parse(JSON.stringify(res?.data?.access_token)))
          this.router.navigate(['/dashboard'])
        }
        else {
          this.utilService.showToastMessage({message: res.message, success: false});
        }
      }, (err: any) => {
        this.utilService.setSpinnerState(false);
      })
    }
  }

  forgot() {
    this.router.navigate(['/auth/forgot-password'])
  }

  signUp() {
    this.router.navigate(['/auth/signup'])
  }
}
