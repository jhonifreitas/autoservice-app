import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'service', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'register', children: [
    { path: 'profile', loadChildren: () => import('./pages/register/profile/profile.module').then( m => m.ProfileRegisterPageModule) },
    { path: 'autonomous', loadChildren: () => import('./pages/register/autonomous/autonomous.module').then( m => m.AutonomousRegisterPageModule) },
  ]},
  { path: 'profile', canActivate: [AuthGuard], children: [
    { path: '', loadChildren: () => import('./pages/profile/form/form.module').then( m => m.ProfileFormPageModule) },
    { path: 'autonomous', loadChildren: () => import('./pages/autonomous/form/form.module').then( m => m.AutonomousFormPageModule) },
  ]},
  { path: 'my-services', canActivate: [AuthGuard], children: [
    { path: '', loadChildren: () => import('./pages/autonomous/service/list/list.module').then( m => m.AutonomousServicePageModule) },
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
