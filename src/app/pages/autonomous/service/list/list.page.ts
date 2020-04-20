import { Component } from '@angular/core';

import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-autonomous-service',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class AutonomousServicePage {

  loading: boolean = true;
  object_list: Service[] = [];

  constructor(
    private api: ApiService,
    private functions: FunctionsService
  ) {}

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('autonomous/service').then(data => {
      this.object_list = data;
    }).catch(_ => {})
    if(event){ event.target.complete();}
    this.loading = false;
  }

  async delete(id: number){
    await this.functions.alertDelete().then(async _ => {
      const loader = await this.functions.loading('Removendo...');
      await this.api.delete('autonomous/service/'+id).then(_ => {
        this.ionViewDidEnter();
        this.functions.message('Serviço removido!')
      }).catch(_ => {});
      loader.dismiss();
    }).catch(_ => {})
  }
}
