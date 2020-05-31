import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-datetime',
  templateUrl: './datetime.page.html',
  styleUrls: ['./datetime.page.scss'],
})
export class DatetimeModal {
  
  constructor(
    private modalCtrl: ModalController,
  ) {
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
