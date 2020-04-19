import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private navCtrl: NavController,
    private storage: StorageService,
    private menuCtrl: MenuController
  ){ }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.storage.isAuthenticated();
    if (isAuth) {
      this.menuCtrl.enable(true);
    }else{
      this.menuCtrl.enable(false);
      this.navCtrl.navigateRoot(['/login'])
    }
    return isAuth
  }
}
