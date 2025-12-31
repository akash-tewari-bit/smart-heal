import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { AuthCheckComponent } from './shared/components/auth-check/auth-check.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./loggedin-wrapper/loggedin-wrapper-module').then( m => m.LoggedinWrapperModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then( m => m.AuthModule)
  },
  {
    path: 'welcome',
    // canActivate: [authGuard],
    component: AuthCheckComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
