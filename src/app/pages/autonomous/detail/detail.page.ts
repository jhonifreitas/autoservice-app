import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { ApiService } from 'src/app/services/api/api.service';
import { AvaliationPage } from '../avaliation/avaliation.page';
import { AutonomousService } from 'src/app/interfaces/autonomous';
import { Autonomous, Review } from 'src/app/interfaces/autonomous';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-autonomous-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class AutonomousDetailPage {

  private id: number;
  private service_id: number;

  loading: boolean = true;
  object: Autonomous;
  service: AutonomousService;

  constructor(
    private api: ApiService,
    private platform: Platform,
    private router: ActivatedRoute,
    private storage: StorageService,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
    private socialSharing: SocialSharing,
  ) {
    this.id = parseInt(this.router.snapshot.paramMap.get('id'));
    this.service_id = parseInt(this.router.snapshot.paramMap.get('service_id'));
  }

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('autonomous/'+this.id+'/detail').then(data => {
      this.object = data;
    }).catch(() => {})
    this.service = this.object.services.filter(item => item.service.id == this.service_id)[0];
    if(event){ event.target.complete();}
    this.loading = false;
  }

  getAge(){
    var timeDiff = Math.abs(Date.now() - new Date(this.object.birthday).getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  }

  getStars(rating: string){
    return new Array(parseInt(rating))
  }

  is_star_half(rating: string){
    return parseFloat(rating) % 1 != 0;
  }

  formatDate(hour: string){
    const now = this.functions.formatDate(new Date(), 'yyyy-MM-ddT');
    return this.functions.formatDate(now+hour, 'HH:mm');
  }

  getDate(date: string){
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);

    if(this.functions.formatDate(date, 'd/MM/y') == this.functions.formatDate(new Date(), 'd/MM/y')){
      return 'hoje';
    }else if(this.functions.formatDate(date, 'd/MM/y') == this.functions.formatDate(yesterday, 'd/MM/y')){
      return 'ontem';
    }else{
      return this.functions.formatDate(date, 'd/MM/y');
    }
  }

  canAddAvaliation(){
    const user = this.storage.getUser();
    if(user.autonomous){
      return false;
    }else if(this.object.reviews.filter(review => review.from_profile.id == user.profile.id).length){
      return false;
    }
    return true;
  }

  async openAvaliation(review: Review = null){
    const user = this.storage.getUser();
    if(user.autonomous){
      return;
    }
    const modal = await this.modalCtrl.create({
      component: AvaliationPage,
      componentProps: {autonomous: this.object, object: review},
      cssClass: 'modal-avaliation',
    });
    await modal.present();
    await modal.onWillDismiss();
    this.ionViewDidEnter();
  }

  openWhatsapp(){
    const msgWhatsapp = 'Olá, vi seu perfil no aplicativo AUTO SERVICE, gostaria de contratar '+
                        'seu serviço de '+this.service.service.name+'. Obrigado.';
    if(this.platform.is('ios')){
      window.location.href = 'https://wa.me/55'+this.object.phone+'?text='+msgWhatsapp;
    }else{
      this.socialSharing.shareViaWhatsAppToReceiver('+55'+this.object.phone, msgWhatsapp);
    }
  }

  showImage(image: string){
    this.photoViewer.show(image);
  }

  async delete(id: number){
    await this.functions.alertDelete().then(async _ => {
      const loader = await this.functions.loading('Removendo...');
      await this.api.delete('review/'+id).then(_ => {
        this.ionViewDidEnter();
        this.functions.message('Avaliação removida!')
      }).catch(_ => {});
      loader.dismiss();
    }).catch(_ => {})
  }
}
