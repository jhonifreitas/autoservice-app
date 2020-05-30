import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Service } from 'src/app/interfaces/service';
import { Address } from 'src/app/interfaces/address';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class ServiceFormPage implements OnInit {

  slideOption = {
    slidesPerView: 'auto',
    spaceBetween: 10,
  };
  address: Address;
  loading: boolean = true;
  categories: Service[] = [];

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private storage: StorageService,
  ) {
  }

  async ngOnInit(){
    this.loading = true;
    this.address = this.storage.getUser().profile.address;
    await this.api.get('service').then(data => {
      this.categories = data;
    }).catch(() => {})
    this.loading = false;
  }

  goToBack(){
    this.navCtrl.back();
  }
}
