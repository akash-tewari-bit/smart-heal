import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Auth } from './auth';

const routes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'signup',
        component: Signup
      },
      {
        path: 'forgot-password',
        component: ForgotPassword
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
