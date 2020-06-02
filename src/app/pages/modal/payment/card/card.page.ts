import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Global } from 'src/app/services/global';
import { PaymentConfirmModal } from '../confirm/confirm.page';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class PaymentCardModal implements OnInit {

  form: FormGroup;
  now: Date = new Date();
  months: string[] = [];
  years: string[] = [];
  cardBrand: any;
  installments: any[] = [];

  constructor(
    private global: Global,
    private navCtrl: NavController,
    private payment: PaymentService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      expiration: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(){
    if(!this.global.pagseguro || !this.global.payment || this.global.payment.method != 'credit_card'){
      this.close();
    }
  }

  getCardBrand() {
    // 4111 1111 1111 1111
    // 12/2030
    // 123
    const number = this.form.get('number').value.toString().replace(' ', '');
    this.payment.getCardBrand(number).then((result: any) => {
      this.cardBrand = result.brand;

      const path = this.global.pagseguro.cards[this.cardBrand.name.toUpperCase()].images.SMALL.path;
      this.cardBrand.image = this.payment.host + path;
    }).catch(_ => {
      this.form.get('number').setErrors({'invalid': true});
    });
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const values = this.form.value;
      const data = {
        number: values.number,
        name: values.name,
        month: values.expiration.split('/')[0],
        year: 20+values.expiration.split('/')[1],
        cvv: values.cvv
      }
      await this.payment.getCardToken(data, this.cardBrand.name).then(async (token) => {
        this.global.payment.card = {
          card_token: token,
          card_number: data.number,
          card_name: data.name,
          card_month: data.month,
          card_year: data.year,
          card_cvv: data.cvv
        };
        this.close();
        const modal = await this.modalCtrl.create({
          component: PaymentConfirmModal
        });
        return await modal.present();
      }).catch(err => {
        console.log(err)
        this.functions.message('Dados inválidos!');
      });
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
