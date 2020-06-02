import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Category } from 'src/app/interfaces/category';
import { ApiService } from 'src/app/services/api/api.service';
import { TypePay, ProfileCategory } from 'src/app/interfaces/profile';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-modal-competence',
  templateUrl: './competence.page.html',
  styleUrls: ['./competence.page.scss'],
})
export class CompetenceModal {

  form: FormGroup;
  object: ProfileCategory;
  types_pay: TypePay[] = [];
  categories: Category[] = [];
  
  constructor(
    private api: ApiService,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
  ) {
    this.form = this.formBuilder.group({
      price: [''],
      category: ['', Validators.required],
      type_pay: ['', Validators.required]
    });
    this.object = this.navParams.get('object');
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('type-pay').then(res => {
      this.types_pay = res;
    }).catch(_ => {});
    await this.api.get('category').then(res => {
      this.categories = res;
    }).catch(_ => {});
    setTimeout(_ => {
      if(this.object){this.setValues()}
    })
    loader.dismiss();
  }

  setValues(){
    this.form.get('category').setValue(this.object.category.id);
    this.form.get('type_pay').setValue(this.object.type_pay.id);
    this.form.get('price').setValue(this.object.price);
  }

  async save(){
    const loader = await this.functions.loading();
    const data = this.form.value;
    if(this.object){
      await this.api.put('profile/category/'+this.object.id, data).then(res => {
        this.close();
        this.functions.message('Competência salva!');
      }).catch(_ => {});
    }else{
      await this.api.post('profile/category', data).then(res => {
        this.close();
        this.functions.message('Competência salva!');
      }).catch(_ => {});
    }
    loader.dismiss();
  }

  delete(){
    this.functions.alertDelete('Atenção!', 'Deseja mesmo deletar está competência?').then(async () => {
      const loader = await this.functions.loading();
      await this.api.delete('profile/category/'+this.object.id).then(res => {
        this.close();
        this.functions.message('Competência deletada!');
      }).catch(_ => {});
      loader.dismiss();
      this.close();
    }).catch(_ => {})
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
