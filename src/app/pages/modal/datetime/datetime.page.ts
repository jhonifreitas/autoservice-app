import { Component } from '@angular/core';
import { ModalController, PickerController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Global } from 'src/app/services/global';

@Component({
  selector: 'app-modal-datetime',
  templateUrl: './datetime.page.html',
  styleUrls: ['./datetime.page.scss'],
})
export class DatetimeModal {

  form: FormGroup;
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
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private pickerCtrl: PickerController,
  ) {
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
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
    this.global.date = data.date;
    this.global.time = data.time;
    this.close();
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
