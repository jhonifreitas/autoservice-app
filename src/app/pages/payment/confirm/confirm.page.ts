import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Global } from 'src/app/services/global';
import { Profile } from 'src/app/interfaces/profile';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class PaymentConfirmPage {

  config = this.storage.getConfig();
  first_pay = new Date();

  constructor(
    private global: Global,
    private navCtrl: NavController,
    private payment: PaymentService,
    private storage: StorageService,
    private functions: FunctionsService
  ) {
    this.first_pay.setDate(this.first_pay.getDate() + this.config.trial_period);
    if(!this.global.payment || !this.global.payment.method){
      this.navCtrl.back();
    }
  }

  async confirm(){
    const loader = await this.functions.loading();
    const data = {
      'payment_type': this.global.payment.method,
      ...this.global.payment.card
    }
    await this.payment.checkout(data).then((res: Profile) => {
      const user = this.storage.getUser();
      user.profile = res;
      this.storage.setUser(user);
      this.functions.message('Bem-vindo autônomo, adicione seu serviços!');
      this.navCtrl.navigateRoot('/profile/my-services');
    }).catch(_ => {});
    loader.dismiss();
  }

  isTicket(){
    if(this.global.payment){
      return this.global.payment.method == 'ticket'
    }
    return false
  }

}
