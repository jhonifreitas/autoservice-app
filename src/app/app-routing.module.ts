import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'service', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/form/form.module').then( m => m.ProfileFormPageModule), canActivate: [AuthGuard] },
  { path: 'payment', loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule), canActivate: [AuthGuard] },
  { path: 'my-services', canActivate: [AuthGuard], children: [
    { path: '', loadChildren: () => import('./pages/autonomous/service/list/list.module').then( m => m.ProfileServicePageModule) },
    { path: 'form', loadChildren: () => import('./pages/autonomous/service/form/form.module').then( m => m.AutonomousServiceFormPageModule) },
  ]},
  { path: 'jobs-done', canActivate: [AuthGuard], children: [
    { path: '', loadChildren: () => import('./pages/autonomous/job_done/list/list.module').then( m => m.JobDonePageModule) },
    { path: 'form', loadChildren: () => import('./pages/autonomous/job_done/form/form.module').then( m => m.JobDoneFormPageModule) },
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
