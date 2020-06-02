import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { Address } from 'src/app/interfaces/address';

@Component({
  selector: 'app-modal-address-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class AddressDetailModal {

  object: Address;
  loading: boolean = true;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) {
  }

  async ngOnInit(){
    this.loading = true;
    this.object = this.navParams.get('object');
    this.loading = false;
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
