import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'intro', loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule) },
  { path: 'login', loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule) },
  { path: 'forgot-password', loadChildren: () => import('./pages/auth/forgot/forgot.module').then( m => m.ForgotPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule), canActivate: [AuthGuard] },
  { path: 'category/:category_id', canActivate: [AuthGuard] , children: [
    { path: '', loadChildren: () => import('./pages/professional/list/list.module').then( m => m.ProfessionalPageModule) },
    { path: 'professional/:id', loadChildren: () => import('./pages/professional/detail/detail.module').then( m => m.ProfessionalDetailPageModule) }
  ]},
  { path: 'payment', canActivate: [AuthGuard] , children: [
    { path: 'info', loadChildren: () => import('./pages/payment/info/info.module').then( m => m.PaymentInfoPageModule) },
    { path: 'card', loadChildren: () => import('./pages/payment/card/card.module').then( m => m.CardPageModule) },
    { path: 'confirm', loadChildren: () => import('./pages/payment/confirm/confirm.module').then( m => m.PaymentConfirmPageModule) },
  ]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
