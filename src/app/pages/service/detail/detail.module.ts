import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceDetailPage } from './detail.page';
import { CancelInfoModal } from '../../modal/cancel/info/info.page';
import { CancelFormModal } from '../../modal/cancel/form/form.page';
import { AddressDetailModal } from '../../modal/address/detail/detail.page';
import { ObservationDetailModal } from '../../modal/observation/detail/detail.page';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ServiceDetailPage
      }
    ])
  ],
  entryComponents: [AddressDetailModal, CancelInfoModal, CancelFormModal, ObservationDetailModal],
  declarations: [ServiceDetailPage, AddressDetailModal, CancelInfoModal, CancelFormModal, ObservationDetailModal]
})
export class ServiceDetailPageModule {}
