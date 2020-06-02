import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ServiceDetailPage } from './detail.page';
import { CancelModal } from '../../modal/cancel/cancel.page';
import { AddressDetailModal } from '../../modal/address/detail/detail.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ServiceDetailPage
      }
    ])
  ],
  entryComponents: [AddressDetailModal, CancelModal],
  declarations: [ServiceDetailPage, AddressDetailModal, CancelModal]
})
export class ServiceDetailPageModule {}
