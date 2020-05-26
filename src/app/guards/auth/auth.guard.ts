import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private navCtrl: NavController,
    private storage: StorageService
  ){ }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const intro = this.storage.getIntro();
    const isAuth = this.storage.isAuthenticated();
    if (intro) {
      if (!isAuth) {this.navCtrl.navigateRoot('/login')}
    }else{
      this.navCtrl.navigateRoot('/intro');
    }
    return isAuth
  }
}
