import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api/api.service';
import { Autonomous, Review } from 'src/app/interfaces/autonomous';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-avaliation',
  templateUrl: './avaliation.page.html',
  styleUrls: ['./avaliation.page.scss'],
})
export class AvaliationPage implements OnInit {

  private object: Review;
  
  form: FormGroup;
  autonomous: Autonomous;
  stars = [
    {'value': 1, 'icon': 'star-outline'},
    {'value': 2, 'icon': 'star-outline'},
    {'value': 3, 'icon': 'star-outline'},
    {'value': 4, 'icon': 'star-outline'},
    {'value': 5, 'icon': 'star-outline'},
  ]
  
  constructor(
    private api: ApiService,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) {
    this.object = this.navParams.get('object');
    this.autonomous = this.navParams.get('autonomous');
    this.form = this.formBuilder.group({
      text: [''],
      note: ['', Validators.required]
    });
  }

  async ngOnInit(){
    if(this.object){
      this.selectStar(this.object.note);
      this.form.get('text').setValue(this.object.text);
    }
  }

  async save(){
    const loader = await this.functions.loading('Salvando...');
    const data = this.form.value;
    data.to_autonomous = this.autonomous.id;
    if(this.object){
      await this.api.put('review/'+this.object.id, data).then(res => {
        this.functions.message('Obrigado por avaliar!');
        this.close();
      }).catch(_ => {})
    }else{
      await this.api.post('review', data).then(res => {
        this.functions.message('Obrigado por avaliar!');
        this.close();
      }).catch(_ => {})
    }
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

  close(){
    this.modalCtrl.dismiss();
  }
}
