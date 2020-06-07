import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AvaliationModal } from './avaliation.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AvaliationModal
      }
    ])
  ],
  declarations: [AvaliationModal]
})
export class AvaliationModalModule {}
