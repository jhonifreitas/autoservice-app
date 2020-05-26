import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage {

  constructor(
    private storage: StorageService,
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) { 
    this.menuCtrl.enable(false);
  }

  goToLogin(){
    this.storage.setIntro(true);
    this.navCtrl.navigateRoot('/login');
  }
}
