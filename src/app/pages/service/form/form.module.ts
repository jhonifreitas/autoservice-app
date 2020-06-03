import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrMaskerModule } from 'br-mask';
import { ServiceFormPage } from './form.page';
import { AddressFormModal } from '../../modal/address/form/form.page';
import { DatetimeModal } from '../../modal/datetime/datetime.page';
import { ObservationFormModal } from '../../modal/observation/form/form.page';

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
  entryComponents: [DatetimeModal, AddressFormModal, ObservationFormModal],
  declarations: [ServiceFormPage, DatetimeModal, AddressFormModal, ObservationFormModal]
})
export class ServiceFormPageModule {}
