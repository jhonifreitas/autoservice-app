import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-observation-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class ObservationDetailModal {
  
  text: string;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) {
    this.text = this.navParams.get('text');
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
