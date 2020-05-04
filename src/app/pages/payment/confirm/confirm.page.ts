import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

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
    private navCtrl: NavController,
    private payment: PaymentService,
    private storage: StorageService,
    private functions: FunctionsService
  ) {
    this.first_pay.setDate(this.first_pay.getDate() + this.config.avaliation_days);
  }

  async confirm(){
    const loader = await this.functions.loading();
    const data = {
      'payment_type': this.storage.getPayMethod()
    }
    await this.payment.checkout(data).then(res => {
      this.storage.removePayMethod();
      this.functions.message('Bem-vindo autônomo, adicione seu serviços!');
      this.navCtrl.navigateRoot('/profile/my-services');
    }).catch(_ => {});
    loader.dismiss();
  }

  isTicket(){
    return this.storage.getPayMethod() == 'ticket'
  }

}
