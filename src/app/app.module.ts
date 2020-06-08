import localePt from '@angular/common/locales/pt';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { registerLocaleData, CurrencyPipe, DatePipe } from '@angular/common';

import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { AppComponent } from './app.component';
import { Global } from 'src/app/services/global';
import { AppRoutingModule } from './app-routing.module';

import { DatetimeModalModule } from './pages/modal/datetime/datetime.module';
import { PaymentInfoModalModule } from './pages/modal/payment/info/info.module';
import { PaymentCardModalModule } from './pages/modal/payment/card/card.module';
import { AvaliationModalModule } from './pages/modal/avaliation/avaliation.module';
import { PaymentConfirmModalModule } from './pages/modal/payment/confirm/confirm.module';

registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DatetimeModalModule,
    IonicModule.forRoot(),
    AvaliationModalModule,
    PaymentInfoModalModule,
    PaymentCardModalModule,
    PaymentConfirmModalModule
  ],
  providers: [
    File,
    Global,
    Camera,
    WebView,
    DatePipe,
    OneSignal,
    StatusBar,
    PhotoViewer,
    SplashScreen,
    CurrencyPipe,
    SocialSharing,
    LaunchNavigator,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
