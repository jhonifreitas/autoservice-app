import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  form: FormGroup;

  constructor(
    private api: ApiService,
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

  async auth(){
    if(this.form.valid){
      const loader = await this.functions.loading('Entrando...');
      const data = this.form.value;
      await this.api.post('login', data).then((res: any) => {
        this.storage.setUser(res);
        this.navCtrl.navigateRoot('/service');
      }).catch(() => {})
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

}
