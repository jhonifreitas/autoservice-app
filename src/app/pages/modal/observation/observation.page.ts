import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Global } from 'src/app/services/global';

@Component({
  selector: 'app-modal-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
})
export class ObservationModal {
  
  form: FormGroup;

  constructor(
    private global: Global,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
  ) {
    this.form = this.formBuilder.group({
      text: [this.global.observation, Validators.required]
    });
  }

  save(){
    this.global.observation = this.form.get('text').value;
    this.close();
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
