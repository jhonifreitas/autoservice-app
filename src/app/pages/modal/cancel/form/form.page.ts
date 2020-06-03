import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-modal-cancel-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class CancelFormModal {

  form: FormGroup;
  private id: number;

  constructor(
    private api: ApiService,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) {
    this.form = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  async ngOnInit(){
    this.id = this.navParams.get('id');
  }

  async save(){
    const loader = await this.functions.loading();
    const data = {
      status: 'recused',
      text_cancel: this.form.get('text').value
    };
    await this.api.patch('service/'+this.id, data).then(res => {
      this.close({deleted: true});
      this.functions.message('Serviço cancelado!');
    }).catch(_ => {})
    loader.dismiss();
  }

  close(param = null){
    this.modalCtrl.dismiss(param);
  }
}
