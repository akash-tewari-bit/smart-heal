import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {
  signUpForm!: FormGroup;
  signUpSuccessful = false;

  constructor(public fb: FormBuilder, public router: Router) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      country: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required]
    })
   }

  ngOnInit() {
  }

  signUp() {
    this.signUpSuccessful = true;
  }
  
  SignUpPopUpClosed() {
    this.signUpSuccessful = false;
    const form = this.signUpForm.value
    this.router.navigate(['/auth/login']);
  }

}
