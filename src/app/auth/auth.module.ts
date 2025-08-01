import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { ForgotPasswordPageModule } from './forgot-password/forgot-password.module';
import { LoginPageModule } from './login/login.module';
import { SignupPageModule } from './signup/signup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    ForgotPasswordPageModule,
    LoginPageModule,
    SignupPageModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
