import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Global } from 'src/app/services/global';
import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  private profile: Profile;

  form: FormGroup;
  now: Date = new Date();
  months: string[] = [];
  years: string[] = [];
  cardBrand: any;
  installments: any[] = [];

  constructor(
    private global: Global,
    private api: ApiService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private payment: PaymentService,
    private functions: FunctionsService
  ) {
    this.form = this.formBuilder.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      month: ['01', Validators.required],
      year: [this.now.getFullYear().toString(), Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(){
    if(!this.global.pagseguro || !this.global.payment || this.global.payment.method != 'credit_card'){
      this.navCtrl.back();
    }else{
      this.initMonths();
      this.initYears();
    }
  }

  initMonths(){
    for (let index = 1; index <= 12; index++) {
      let month = index.toString();
      if(index < 10){
        month = '0'+month;
      }
      this.months.push(month);
    }
  }

  initYears(){
    let year = this.now.getFullYear();
    for (let index = year; index <= year+20; index++) {
      this.years.push(index.toString());
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
    }).catch(err => {
      console.log(err)
      this.form.get('number').setErrors({'invalid': true});
    });
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      await this.payment.getCardToken(data, this.cardBrand.name).then(token => {
        this.global.payment.card = {
          card_token: token,
          card_number: data.number,
          card_name: data.name,
          card_cpf: data.cpf,
          card_month: data.month,
          card_year: data.year,
          card_cvv: data.cvv
        };
        this.navCtrl.navigateForward('/payment/confirm');
      }).catch(err => {
        this.functions.message('Dados inválidos!');
      });
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }
}
