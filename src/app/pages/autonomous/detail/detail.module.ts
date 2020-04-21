import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutonomousDetailPage } from './detail.page';
import { AvaliationPage } from '../avaliation/avaliation.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AutonomousDetailPage
      }
    ])
  ],
  entryComponents: [AvaliationPage],
  declarations: [AutonomousDetailPage, AvaliationPage]
})
export class AutonomousDetailPageModule {}
