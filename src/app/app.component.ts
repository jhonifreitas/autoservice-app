import { Component, QueryList, ViewChildren } from '@angular/core';
import { Platform, IonRouterOutlet, NavController, MenuController, ModalController } from '@ionic/angular';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { Global } from './services/global';
import { environment } from 'src/environments/environment';
import { StorageService } from './services/storage/storage.service';
import { PaymentInfoModal } from './pages/modal/payment/info/info.page';
import { FunctionsService } from './services/functions/functions.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  private lastTimeBackPress: number = 0;
  private timePeriodToExit: number = 2000;

  selectedIndex = 0;

  constructor(
    private global: Global,
    private platform: Platform,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    public storage: StorageService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')){
        this.statusBar.backgroundColorByHexString('#E8EFFD');
        this.statusBar.styleDefault();
        this.splashScreen.hide();

        this.oneSignal.startInit(environment.onesignal_key, environment.onesignal_id);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.oneSignal.handleNotificationOpened().subscribe((res) => {
          console.log(res)
        });

        this.oneSignal.endInit();

        // BUTTON BACK DEVICE
        this.platform.backButton.subscribe(() => {
          this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
            if(outlet.canGoBack()){
              outlet.pop();
            }else{
              const time = new Date().getTime() - this.lastTimeBackPress;
              if (time < this.timePeriodToExit) {
                navigator['app'].exitApp();
              } else {
                this.functions.message('Aperte voltar novamente para sair!', 2000);
                this.lastTimeBackPress = new Date().getTime();
              }
            }
          })
        });
      }
    });
  }

  async openPaymentInfo(){
    const modal = await this.modalCtrl.create({
      component: PaymentInfoModal
    });
    return await modal.present();
  }

  goToServiceForm(){
    this.global.professional = null;
    this.navCtrl.navigateForward('/service/form');
  }

  isProfessional(){
    if (!this.storage.getUser()){return false}
    return this.storage.getUser().profile.types == 'professional';
  }

  isCommon(){
    if (!this.storage.getUser()){return false}
    return this.storage.getUser().profile.types == 'common';
  }

  logout(){
    this.menuCtrl.close().finally(() => {
      this.storage.removeUser();
      this.storage.removeConfig();
      this.navCtrl.navigateRoot('/login');
    });
  }
}
