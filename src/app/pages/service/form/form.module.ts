import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ServiceFormPage } from './form.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ServiceFormPage
      }
    ])
  ],
  declarations: [ServiceFormPage]
})
export class ServiceFormPageModule {}
