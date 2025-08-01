import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  invalidUsername = false;
  invalidPassword = false;
  showSpinner = false;

  constructor(public router: Router, public fb: FormBuilder, public authService: AuthService, public utilService: UtilityService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  login() {
    this.invalidUsername = false;
    this.invalidPassword = false;
    const form = this.loginForm.value
    if (form.username && form.password) {
      this.utilService.setSpinnerState(true);
      const payload = {
        username: form.username,
        password: form.password,
      }
      this.authService.login(payload).subscribe((res: any) => {
        console.log(res);
        this.utilService.setSpinnerState(false);
        if (res.access_token) {
          this.router.navigate(['/home'])
        }
      }, (err: any) => {
        console.log(err);
        this.utilService.setSpinnerState(false);
        if ((form.username != 'akash')) {
          this.invalidUsername = true;
        }
        if ((form.password != 'admin')) {
          this.invalidPassword = true;
        }
      })

      // if((form.username === 'akash') && (form.password === 'admin@123')) {
      //   this.router.navigate(['/home'])
      // }
      // else {
      //   if((form.username != 'akash')) {
      //     this.invalidUsername = true;
      //   }
      //   if((form.password != 'admin')) {
      //     this.invalidPassword = true;
      //   }
      // }
    }
  }

  errorPopUpClosed() {
    this.invalidUsername = false;
    this.invalidPassword = false;
    this.loginForm.reset();
  }

  forgot() {
    this.router.navigate(['/auth/forgot-password'])
  }

  signUp() {
    this.router.navigate(['/auth/signup'])
  }

}
