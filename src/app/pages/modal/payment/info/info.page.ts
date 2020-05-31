import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, ModalController } from '@ionic/angular';

import { PaymentCardModal } from '../card/card.page';
import { PaymentConfirmModal } from '../confirm/confirm.page';

import { Global } from 'src/app/services/global';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class PaymentInfoModal implements OnInit {

  constructor(
    private global: Global,
    private api: ApiService,
    private navCtrl: NavController,
    private storage: StorageService,
    private paymentApi: PaymentService,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
    private actionSheetController: ActionSheetController
  ) {
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.paymentApi.loadScript();
    await this.api.get('config').then(res => {
      this.storage.setConfig(res);
    }).catch(_ => {});
    loader.dismiss();
  }

  async optionPayment() {
    const loader = await this.functions.loading();
    const payMethods = [];
    await this.paymentApi.getPaymentMethods().then(async (res: any) => {
      if(res.BOLETO.options.BOLETO.status == 'AVAILABLE'){
        const button = {
          text: 'Boleto',
          role: 'destructive',
          icon: 'barcode',
          handler: () => {
            this.goToNext('ticket')
          }
        };
        payMethods.push(button);
      }
      for(let item in res.CREDIT_CARD.options){
        if(res.CREDIT_CARD.options[item].status == 'AVAILABLE'){
          const button = {
            text: 'Cartão de Crédito',
            role: 'destructive',
            icon: 'card',
            handler: () => {
              this.global.pagseguro = {cards: res.CREDIT_CARD.options};
              this.goToNext('credit_card')
            }
          }
          payMethods.push(button);
          break;
        }
      }

      const actionSheet = await this.actionSheetController.create({
        header: 'Opções de pagamento',
        buttons: payMethods
      });
      await actionSheet.present();
    }).catch(_ => {
      this.functions.message('Oops! Ocorreu algum erro.')
    });
    loader.dismiss();
  }

  async goToNext(method: 'credit_card' | 'ticket'){
    this.global.payment = {method: method};
    const profile = this.storage.getUser().profile;
    this.close();
    
    if(!profile.cpf){
      this.functions.message('Atualize seu dados antes de continuar!');
      this.navCtrl.navigateForward('/profile');
    }else{
      let page:any = PaymentConfirmModal;
      if(method == 'credit_card'){
        page = PaymentCardModal;
      }
      const modal = await this.modalCtrl.create({
        component: page
      });
      return await modal.present();
    }
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
