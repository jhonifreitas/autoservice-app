import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
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
    private api: ApiService,
    private navCtrl: NavController,
    private storage: StorageService,
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
      cvv: ['', [Validators.required, Validators.minLength(3)]],
      installment: ['', Validators.required],
    });
  }

  ngOnInit(){
    this.initMonths();
    this.initYears();
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

      const payments = this.storage.getPaymentMethods();
      const path = payments.CREDIT_CARD.options[this.cardBrand.name.toUpperCase()].images.SMALL.path;
      this.cardBrand.image = this.payment.host + path;
      
      this.initInstallments();
    }).catch(err => {
      console.log(err)
      this.form.get('number').setErrors({'invalid': true});
    });
  }

  initInstallments(){
    if (this.cardBrand) {
      this.payment.getInstallments(this.cardBrand.name).then((result: any) => {
        this.installments = result;
        this.form.get('installment').setValue(this.installments[0].quantity.toString());
      }).catch(error => {
        console.error('error getting installments', error);
        this.form.setErrors({'installment': true});
      });
    }
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }
}
