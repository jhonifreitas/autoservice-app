import { Component } from '@angular/core';

import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  slideOption = {
    slidesPerView: 'auto',
    spaceBetween: 10,
  };
  loading: boolean = true;
  categories: Service[] = [];
  services: any[] = [];
  histories: any[] = [];

  constructor(
    private api: ApiService,
    public storage: StorageService
  ) {}

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('service').then(data => {
      this.categories = data;
    }).catch(() => {})
    if(event){ event.target.complete();}
    this.loading = false;
  }

}
