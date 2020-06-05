import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, Platform } from '@ionic/angular';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  togglePass: boolean = false;

  constructor(
    private api: ApiService,
    private platform: Platform,
    private oneSignal: OneSignal,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private functions: FunctionsService
  ) { 
    this.menuCtrl.enable(false);
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(){
    if(this.platform.is('cordova')){
      this.statusBar.backgroundColorByHexString('#E8EFFD');
      this.statusBar.styleDefault();
    }
  }

  async auth(){
    if(this.form.valid){
      const loader = await this.functions.loading('Entrando...');
      const data = this.form.value;
      if(this.platform.is('cordova')){
        await this.oneSignal.getIds().then(res => {
          data.onesignal = res.userId;
        });
      }
      await this.api.post('login', data).then((res: any) => {
        this.storage.setUser(res);
        this.menuCtrl.enable(true);
        this.navCtrl.navigateRoot('/home');
      }).catch(() => {})
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

}
