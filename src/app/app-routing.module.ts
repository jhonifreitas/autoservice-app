import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'service', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule) },
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
  ]},
  { path: 'service', canActivate: [AuthGuard], children: [
    { path: '', loadChildren: () => import('./pages/service/service.module').then( m => m.ServicePageModule) },
    { path: ':service_id/autonomous', children: [
      { path: '', loadChildren: () => import('./pages/autonomous/list/list.module').then( m => m.AutonomousPageModule) },
      { path: ':id', loadChildren: () => import('./pages/autonomous/detail/detail.module').then( m => m.AutonomousDetailPageModule) },
    ]}
  ]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
