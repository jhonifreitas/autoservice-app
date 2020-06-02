import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, IonSlides } from '@ionic/angular';

import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage {

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    private navCtrl: NavController,
    private storage: StorageService,
    private menuCtrl: MenuController
  ) { 
    this.menuCtrl.enable(false);
  }

  goToNext(){
    this.slides.slideNext();
  }
  
  goToLogin(){
    this.storage.setIntro(true);
    this.navCtrl.navigateRoot('/login');
  }
}
