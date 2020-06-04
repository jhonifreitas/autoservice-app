import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, PickerController, NavParams } from '@ionic/angular';

import { Global } from 'src/app/services/global';
import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-modal-datetime',
  templateUrl: './datetime.page.html',
  styleUrls: ['./datetime.page.scss'],
})
export class DatetimeModal {

  form: FormGroup;
  object: Service;
  minDate: string = new Date().toISOString();
  maxDate: number = new Date().getFullYear() + 1;
  monthShortNames: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  optionTimes = [
    {text: 'das 06:00 às 08:00', value: 'das 06:00 às 08:00'},
    {text: 'das 08:00 às 10:00', value: 'das 08:00 às 10:00'},
    {text: 'das 10:00 às 12:00', value: 'das 10:00 às 12:00'},
    {text: 'das 12:00 às 14:00', value: 'das 12:00 às 14:00'},
    {text: 'das 14:00 às 16:00', value: 'das 14:00 às 16:00'},
    {text: 'das 16:00 às 18:00', value: 'das 16:00 às 18:00'},
    {text: 'das 18:00 às 20:00', value: 'das 18:00 às 20:00'},
  ]
  
  constructor(
    private global: Global,
    private api: ApiService,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
    private pickerCtrl: PickerController,
  ) {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
    this.object = this.navParams.get('object');
    if(this.object){
      this.form.get('date').setValue(this.object.date);
      this.form.get('time').setValue(this.object.time);
    }else if(this.global.date && this.global.time){
      this.form.get('date').setValue(this.global.date);
      this.form.get('time').setValue(this.global.time);
    }
  }

  async openPicker(){
    const picker = await this.pickerCtrl.create({
      columns: [{name: 'time', options: this.optionTimes}],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value) => {
            this.form.get('time').setValue(value.time.value);
          }
        }
      ]
    });
    await picker.present();
  }

  async save(){
    const data = this.form.value;
    if(this.object){
      const loader = await this.functions.loading();
      await this.api.patch('service/'+this.object.id, data).then(res => {
        this.functions.message('Data e Horário alterado!');
        this.close(data);
      }).catch(_ => {})
      loader.dismiss();
    }else{
      this.global.date = data.date;
      this.global.time = data.time;
      this.close();
    }
  }

  close(param = null){
    this.modalCtrl.dismiss(param);
  }
}
