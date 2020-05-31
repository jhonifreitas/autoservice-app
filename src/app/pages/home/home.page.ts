import { Component } from '@angular/core';

import { Category } from 'src/app/interfaces/category';
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
  services: any[] = [];
  histories: any[] = [];
  categories: Category[] = [];

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
