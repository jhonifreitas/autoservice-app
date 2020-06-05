import { Component, ViewChild, OnInit } from '@angular/core';
import { MenuController, NavController, IonSlides, Platform } from '@ionic/angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';

import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit{

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private storage: StorageService,
    private menuCtrl: MenuController
  ) { 
    this.menuCtrl.enable(false);
  }

  ngOnInit(){
    if(this.platform.is('cordova')){
      this.statusBar.backgroundColorByHexString('#E8EFFD');
      this.statusBar.styleDefault();
    }
  }

  goToNext(){
    this.slides.slideNext();
  }
  
  goToLogin(){
    this.storage.setIntro(true);
    this.navCtrl.navigateRoot('/login');
  }
}
