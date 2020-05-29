import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'intro', loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule) },
  { path: 'forgot-password', loadChildren: () => import('./pages/forgot/forgot.module').then( m => m.ForgotPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]},
  { path: 'category/:category_id', canActivate: [AuthGuard] , children: [
    { path: '', loadChildren: () => import('./pages/professional/list/list.module').then( m => m.ProfessionalPageModule) },
    { path: 'professional/:id', loadChildren: () => import('./pages/professional/detail/detail.module').then( m => m.ProfessionalDetailPageModule)}
  ]},
  { path: 'payment', canActivate: [AuthGuard] , children: [
    { path: 'info', loadChildren: () => import('./pages/payment/info/info.module').then( m => m.PaymentInfoPageModule) },
    { path: 'card', loadChildren: () => import('./pages/payment/card/card.module').then( m => m.CardPageModule) },
    { path: 'confirm', loadChildren: () => import('./pages/payment/confirm/confirm.module').then( m => m.PaymentConfirmPageModule) },
  ]},
  { path: 'profile', canActivate: [AuthGuard], children: [
    { path: '', loadChildren: () => import('./pages/profile/form/form.module').then( m => m.ProfileFormPageModule) },
    { path: 'address', loadChildren: () => import('./pages/profile/address/address.module').then( m => m.AddressPageModule) },
    { path: 'jobs-done', children: [
      { path: '', loadChildren: () => import('./pages/profile/job_done/list/list.module').then( m => m.JobDonePageModule) },
      { path: 'form', loadChildren: () => import('./pages/profile/job_done/form/form.module').then( m => m.JobDoneFormPageModule) },
    ]},
    { path: 'my-services', children: [
      { path: '', loadChildren: () => import('./pages/profile/service/list/list.module').then( m => m.ProfileServicePageModule) },
      { path: 'form', loadChildren: () => import('./pages/profile/service/form/form.module').then( m => m.ProfileServiceFormPageModule) },
    ]},
  ]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
