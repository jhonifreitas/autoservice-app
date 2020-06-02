import { Component } from '@angular/core';

import { Category } from 'src/app/interfaces/category';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Service } from 'src/app/interfaces/service';

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
  histories: any[] = [];
  categories: Category[] = [];
  waiting_services: Service[] = [];
  approved_services: Service[] = [];
  historic_services: Service[] = [];
  requested_services: Service[] = [];

  constructor(
    private api: ApiService,
    public storage: StorageService
  ) {}

  async ionViewDidEnter(event=null){
    this.loading = true;
    if(this.isProfessional()){
    }else{
      await this.api.get('category').then(data => {
        this.categories = data;
      }).catch(() => {});
    }
    if(event){ event.target.complete();}
    this.loading = false;
  }

  isProfessional(){
    return this.storage.getUser().profile.types == 'professional';
  }
}
