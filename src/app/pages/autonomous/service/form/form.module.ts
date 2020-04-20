import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrMaskerModule } from 'br-mask';

import { AutonomousServiceFormPage } from './form.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    BrMaskerModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AutonomousServiceFormPage
      },
      {
        path: ':id',
        component: AutonomousServiceFormPage
      }
    ])
  ],
  declarations: [AutonomousServiceFormPage]
})
export class AutonomousServiceFormPageModule {}
