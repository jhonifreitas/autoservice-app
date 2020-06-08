import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, Platform } from '@ionic/angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { DatetimeModal } from '../../modal/datetime/datetime.page';
import { CancelInfoModal } from '../../modal/cancel/info/info.page';
import { CancelFormModal } from '../../modal/cancel/form/form.page';
import { AddressDetailModal } from '../../modal/address/detail/detail.page';
import { ObservationDetailModal } from '../../modal/observation/detail/detail.page';

import { Address } from 'src/app/interfaces/address';
import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

declare var google;

@Component({
  selector: 'app-service-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class ServiceDetailPage implements OnInit {

  object: Service;
  loading: boolean = true;

  constructor(
    private api: ApiService,
    private platform: Platform,
    private statusBar: StatusBar,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private storage: StorageService,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private functions: FunctionsService
  ) { }

  ngOnInit(){
    if(this.platform.is('cordova')){
      if(this.isProfessional()){
        this.statusBar.backgroundColorByHexString('#624AFC');
        this.statusBar.styleLightContent();
      }else{
        this.statusBar.backgroundColorByHexString('#E8EFFD');
        this.statusBar.styleDefault();
      }
    }
  }

  async ionViewDidEnter(){
    this.loading = true;
    const id = parseInt(this.router.snapshot.paramMap.get('id'));
    await this.api.get('service/'+id).then(res => {
      this.object = res;
    }).catch(() => {});
    this.loading = false;
    setTimeout(() => {
      if(this.object.lat && this.object.lng){this.loadMap()};
    });
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

  async openDatetime(){
    const modal = await this.modalCtrl.create({
      component: DatetimeModal,
      componentProps: {object: this.object}
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data){
      this.object.date = data.date;
      this.object.time = data.time;
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
    const url = '/professional/'+this.object.professional.id;
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
