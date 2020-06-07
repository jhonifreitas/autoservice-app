import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Global } from 'src/app/services/global';
import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-avaliation',
  templateUrl: './avaliation.page.html',
  styleUrls: ['./avaliation.page.scss'],
})
export class AvaliationModal{
  
  stars = [
    {'value': 1, 'icon': 'star-outline'},
    {'value': 2, 'icon': 'star-outline'},
    {'value': 3, 'icon': 'star-outline'},
    {'value': 4, 'icon': 'star-outline'},
    {'value': 5, 'icon': 'star-outline'},
  ]
  form: FormGroup;
  professional: Profile;
  object_list: Profile[] = [];
  
  constructor(
    public global: Global,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) {
    this.form = this.formBuilder.group({
      text: [''],
      note: ['', Validators.required]
    });
  }

  async save(){
    const loader = await this.functions.loading('Salvando...');
    const data = this.form.value;
    data.to_profile = this.professional.id;
    
    await this.api.post('review/create', data).then(res => {
      this.global.review_pending = this.global.review_pending.filter(profile => profile.id != res.to_profile.id);
      this.functions.message('Obrigado por avaliar!');
      this.close();
    }).catch(_ => {})
    loader.dismiss();
  }

  selectStar(value: number){
    this.form.get('note').setValue(value);
    this.stars.forEach(star => {
      if(value == 1 && [1].indexOf(star.value) != -1){
        star.icon = 'star';
      }else if(value == 2 && [1,2].indexOf(star.value) != -1){
        star.icon = 'star';
      }else if(value == 3 && [1,2,3].indexOf(star.value) != -1){
        star.icon = 'star';
      }else if(value == 4 && [1,2,3,4].indexOf(star.value) != -1){
        star.icon = 'star';
      }else if(value == 5 && [1,2,3,4,5].indexOf(star.value) != -1){
        star.icon = 'star';
      }else{
        star.icon = 'star-outline';
      }
    });
  }

  checkStar(star: number, rating: string){
    return this.functions.nameStar(star, rating);
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
