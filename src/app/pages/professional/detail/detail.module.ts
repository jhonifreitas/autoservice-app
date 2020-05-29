import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfessionalDetailPage } from './detail.page';
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
        component: ProfessionalDetailPage
      }
    ])
  ],
  entryComponents: [AvaliationPage],
  declarations: [ProfessionalDetailPage, AvaliationPage]
})
export class ProfessionalDetailPageModule {}
