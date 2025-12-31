import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  signUpForm!: FormGroup;
  formSubmitted = false;
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.isMobile = window.innerWidth < 768; // Consider 768px as the breakpoint for mobile
  }

  constructor(public fb: FormBuilder, public router: Router, public authService: AuthService, public utilService: UtilityService) {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      entityName: ['', Validators.required],
      country: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(5)]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(18), Validators.pattern(/^(?=[a-zA-Z])(?=.*[._-])(?!.*[._-]{2})[a-zA-Z][a-zA-Z0-9._-]{1,18}[a-zA-Z0-9]$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  signUp() {
    this.signUpForm.markAllAsTouched();
  this.formSubmitted = true;
  if(this.signUpForm.valid) {
    const form = this.signUpForm.value
    this.utilService.setSpinnerState(true);
    this.authService.register(form).subscribe((res: any) => {
      this.formSubmitted = false;
      this.utilService.setSpinnerState(false);
      if(res.success) {
        this.utilService.showToastMessage({message: res.message, success: true});
        this.router.navigate(['auth/login'])
      }
      else {
        this.utilService.showToastMessage({message: res.message, success: false});
      }
    }, err => {
      this.utilService.setSpinnerState(false);
    })
  }
  }

  cancel() {
    this.router.navigate(['/auth/login']);
  }

  signIn() {
    this.router.navigate(['/auth/login'])
  }

}
