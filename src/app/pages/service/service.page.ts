import { Component } from '@angular/core';

import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-service',
  templateUrl: 'service.page.html',
  styleUrls: ['service.page.scss'],
})
export class ServicePage {

  loading: boolean = true;
  object_list: Service[] = [];

  constructor(
    private api: ApiService
  ) {}

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('service').then(data => {
      this.object_list = data;
    }).catch(() => {})
    if(event){ event.target.complete();}
    this.loading = false;
  }

}
