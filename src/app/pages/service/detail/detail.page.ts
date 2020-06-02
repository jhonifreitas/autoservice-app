import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { Address } from 'src/app/interfaces/address';
import { Service } from 'src/app/interfaces/service';
import { CancelModal } from '../../modal/cancel/cancel.page';
import { ApiService } from 'src/app/services/api/api.service';
import { AddressDetailModal } from '../../modal/address/detail/detail.page';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class ServiceDetailPage {

  object: Service;
  loading: boolean = true;

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) {
  }

  async ionViewDidEnter(){
    this.loading = true;
    const id = parseInt(this.router.snapshot.paramMap.get('id'));
    await this.api.get('service/'+id).then(res => {
      this.object = res;
    }).catch(() => {});
    this.loading = false;
  }

  async openAddress(){
    const address:Address = {
      zipcode: this.object.zipcode,
      address: this.object.address,
      number: this.object.number,
      district: this.object.district,
      city: this.object.city,
      complement: this.object.complement
    }
    const modal = await this.modalCtrl.create({
      component: AddressDetailModal,
      componentProps: {object: address}
    });
    return await modal.present();
  }

  async delete(){
    const modal = await this.modalCtrl.create({
      component: CancelModal,
      componentProps: {id: this.object.id}
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data && data.deleted){
      this.goToBack();
    }
  }

  goToProfessional(){
    const url = '/category/'+this.object.category.id+'/professional/'+this.object.professional.id;
    this.navCtrl.navigateForward([url, {service_id: this.object.id}])
  }

  showImage(image: string){
    this.photoViewer.show(image);
  }

  goToBack(){
    this.navCtrl.back();
  }
}
