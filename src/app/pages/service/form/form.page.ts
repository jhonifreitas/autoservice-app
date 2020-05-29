import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class ServiceFormPage {

  constructor(
    private navCtrl: NavController,
    private storage: StorageService,
  ) {
  }
}
