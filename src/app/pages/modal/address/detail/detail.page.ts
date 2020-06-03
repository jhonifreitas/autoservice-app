import { Component } from '@angular/core';
import { ModalController, NavParams, Platform, ActionSheetController } from '@ionic/angular';

import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

import { Address } from 'src/app/interfaces/address';
import { StorageService } from 'src/app/services/storage/storage.service';

declare var google;

@Component({
  selector: 'app-modal-address-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class AddressDetailModal {

  object: Address;
  loading: boolean = true;
  appOptions: any[] = [];

  constructor(
    private platform: Platform,
    private navParams: NavParams,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private launchNavigator: LaunchNavigator,
    private actionSheetController: ActionSheetController
  ) {
  }

  async ngOnInit(){
    this.loading = true;
    this.object = this.navParams.get('object');
    
    await this.platform.ready();
    if(this.platform.is('cordova')){
      this.launchNavigator.availableApps().then(apps => {
        for(let app in apps){
          if(apps[app]){
            const button = {
              text: this.launchNavigator.getAppDisplayName(app),
              role: 'destructive',
              handler: () => {
                this.openRoute(app);
              }
            }
            this.appOptions.push(button);
          }
        }
      });
    }
    this.loading = false;
    setTimeout(() => {
      this.loadMap();
    });
  }

  loadMap(){
    var position = {lat: this.object.lat, lng: this.object.lng }
    const map = new google.maps.Map(document.getElementById("map_modal"), {
      center: position,
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: 'none'
    });
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      icon: {
        url: '/assets/icon/pointer.png',
        scaledSize : new google.maps.Size(24, 32),
      }
    });
  }

  async openMap() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Aplicativos',
      buttons: this.appOptions
    });
    await actionSheet.present();
  }

  openRoute(app: string){
    const options: LaunchNavigatorOptions = {
      app: app
    }

    this.launchNavigator.navigate([this.object.lat, this.object.lng], options).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    });
  }

  isProfessional(){
    return this.storage.getUser().profile.types == 'professional';
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
