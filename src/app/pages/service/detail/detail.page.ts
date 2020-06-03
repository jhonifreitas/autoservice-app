import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { Address } from 'src/app/interfaces/address';
import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { CancelInfoModal } from '../../modal/cancel/info/info.page';
import { CancelFormModal } from '../../modal/cancel/form/form.page';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddressDetailModal } from '../../modal/address/detail/detail.page';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { ObservationDetailModal } from '../../modal/observation/detail/detail.page';

declare var google;

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
    private storage: StorageService,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) { }

  async ionViewDidEnter(){
    this.loading = true;
    const id = parseInt(this.router.snapshot.paramMap.get('id'));
    await this.api.get('service/'+id).then(res => {
      this.object = res;
    }).catch(() => {});
    this.loadMap();
    this.loading = false;
  }

  loadMap(){
    var position = {lat: this.object.lat, lng: this.object.lng }
    const map = new google.maps.Map(document.getElementById("map"), {
      center: position,
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: 'none'
    });
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      icon: {
        url: '/assets/icon/pointer.png',
        scaledSize : new google.maps.Size(24, 32),
      }
    });
  }

  async openAddress(){
    const address:Address = {
      lat: this.object.lat,
      lng: this.object.lng,
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

  async openObservation(){
    const modal = await this.modalCtrl.create({
      component: ObservationDetailModal,
      componentProps: {text: this.object.observation}
    });
    return await modal.present();
  }

  async cancel(){
    const modal = await this.modalCtrl.create({
      component: CancelInfoModal,
      componentProps: {id: this.object.id}
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data && data.deleted){
      this.goToBack();
    }
  }

  async recuse(){
    const modal = await this.modalCtrl.create({
      component: CancelFormModal,
      componentProps: {id: this.object.id}
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data && data.deleted){
      this.goToBack();
    }
  }

  async accept(){
    const loader = await this.functions.loading();
    const data = {status: 'approved'};
    this.api.patch('service/'+this.object.id, data).then(res => {
      this.goToBack();
      this.functions.message('Serviço aceito!');
    }).catch(_ => {});
    loader.dismiss();
  }

  goToProfessional(){
    const url = '/category/'+this.object.category.id+'/professional/'+this.object.professional.id;
    this.navCtrl.navigateForward([url, {service_id: this.object.id}])
  }

  showImage(image: string){
    this.photoViewer.show(image);
  }

  isProfessional(){
    return this.storage.getUser().profile.types == 'professional';
  }

  goToBack(){
    this.navCtrl.back();
  }
}
