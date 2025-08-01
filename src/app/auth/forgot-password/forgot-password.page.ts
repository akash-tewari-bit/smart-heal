import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm!: FormGroup;
  validUsername = false;
  passwordChanged = false;

  constructor(public router: Router, public fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
   }

  ngOnInit() {
  }

  validateUser() {
    this.validUsername = false;
    const usersList = ['akash'];
    const form = this.forgotPasswordForm.value;
    if(usersList.find((e: any) => e === form.username)) {
      this.validUsername = true;
    }
  }

  resetPassword() {
    this.passwordChanged = false;
    const form = this.forgotPasswordForm.value;
    if(form.newPassword === form.confirmPassword) {
      this.passwordChanged = true;
    }
  }

  resetPasswordPopUpClosed() {
    this.router.navigate(['/auth/login']);
  }

}
