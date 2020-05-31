import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrMaskerModule } from 'br-mask';
import { ServiceFormPage } from './form.page';
import { AddressModal } from '../../modal/address/address.page';
import { DatetimeModal } from '../../modal/datetime/datetime.page';
import { ObservationModal } from '../../modal/observation/observation.page';

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
        component: ServiceFormPage
      }
    ])
  ],
  entryComponents: [DatetimeModal, AddressModal, ObservationModal],
  declarations: [ServiceFormPage, DatetimeModal, AddressModal, ObservationModal]
})
export class ServiceFormPageModule {}
