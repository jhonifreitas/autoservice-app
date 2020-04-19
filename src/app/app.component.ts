import { Component, QueryList, ViewChildren } from '@angular/core';
import { Platform, IonRouterOutlet, NavController } from '@ionic/angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
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

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private splashScreen: SplashScreen,
    private functions: FunctionsService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')){
        this.statusBar.backgroundColorByHexString('#eb445a');
        this.statusBar.styleLightContent();
        this.splashScreen.hide();

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

  logout(){
    localStorage.clear();
    this.navCtrl.navigateRoot('/login');
  }
}
