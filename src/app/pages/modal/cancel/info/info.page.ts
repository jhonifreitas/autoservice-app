import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-modal-cancel-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class CancelInfoModal {

  private id: number;

  constructor(
    private api: ApiService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) {}

  async ngOnInit(){
    this.id = this.navParams.get('id');
  }

  async delete(){
    const loader = await this.functions.loading();
    const data = {status: 'canceled'};
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
