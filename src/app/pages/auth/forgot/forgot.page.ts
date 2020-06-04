import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage {

  form: FormGroup;
  togglePass: boolean = false;

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private functions: FunctionsService
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  async send(){
    if(this.form.valid){
      const loader = await this.functions.loading('Buscando...');
      const data = this.form.value;
      await this.api.post('password-reset', data).then(_ => {
        this.functions.message('Verifique seu email!');
      }).catch(() => {});
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

  goToBack(){
    this.navCtrl.back();
  }

}
