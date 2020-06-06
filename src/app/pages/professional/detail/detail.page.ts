import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController } from '@ionic/angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Global } from 'src/app/services/global';
import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { AvaliationPage } from '../avaliation/avaliation.page';
import { Profile, Review, Gallery } from 'src/app/interfaces/profile';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-professional-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class ProfessionalDetailPage implements OnInit {

  private id: number;
  private service_id: number;

  object: Profile;
  service: Service;
  reviews: Review[] = [];
  gallery: Gallery[] = [];
  loading: boolean = true;
  segment: string = 'avaliations';

  constructor(
    private global: Global,
    private api: ApiService,
    private platform: Platform,
    private statusBar: StatusBar,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private storage: StorageService,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
    private socialSharing: SocialSharing,
  ) {
    this.id = parseInt(this.router.snapshot.paramMap.get('id'));
    this.service_id = parseInt(this.router.snapshot.paramMap.get('service_id'));
  }

  ngOnInit(){
    if(this.platform.is('cordova')){
      this.statusBar.backgroundColorByHexString('#624AFC');
      this.statusBar.styleLightContent();
    }
  }

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('professional/'+this.id).then(data => {
      this.object = data;
    }).catch(() => {});
    if(this.service_id){await this.getService()}
    await this.getAvaliations();
    await this.getGallery();
    if(event){ event.target.complete();}
    this.loading = false;
  }

  canAddAvaliation(){
    const user = this.storage.getUser();
    if(this.isProfessional()){
      return false;
    }else if(this.reviews.filter(review => review.from_profile.id == user.profile.id).length){
      return false;
    }
    return true;
  }

  async openAvaliation(review: Review = null){
    if(this.isProfessional()){
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

  async getAvaliations(){
    this.loading = true;
    await this.api.get('review').then(res => {
      this.reviews = res;
    }).catch(_ => {});
    this.loading = false;
  }

  async getGallery(){
    this.loading = true;
    await this.api.get('gallery').then(res => {
      this.gallery = res;
    }).catch(_ => {});
    this.loading = false;
  }
  
  async getService(){
    this.loading = true;
    await this.api.get('service/'+this.service_id).then(res => {
      this.service = res;
    }).catch(_ => {});
    this.loading = false;
  }

  openWhatsapp(){
    const msgWhatsapp = 'Olá!%0a'+
                        'Encontrei seu perfil no aplicativo *GO JOB*.%0a'+
                        'Gostaria de saber mais sobre seus serviços.%0a'+
                        'Obrigado!';
    if(this.platform.is('ios')){
      window.location.href = 'https://wa.me/55'+this.object.phone+'?text='+msgWhatsapp;
    }else{
      this.socialSharing.shareViaWhatsAppToReceiver('+55'+this.object.phone, msgWhatsapp);
    }
  }

  async changeSegment(){
    if(this.segment == 'avaliations'){
      await this.getAvaliations();
    }else if(this.segment == 'gallery'){
      await this.getGallery();
    }
  }

  showImage(image: string){
    this.photoViewer.show(image);
  }

  checkStar(star: number, rating: string){
    return this.functions.nameStar(star, rating);
  }

  isProfessional(){
    return this.storage.getUser().profile.types == 'professional';
  }

  requestService(){
    this.global.professional = this.object;
    this.navCtrl.navigateForward('/service/form');
  }

  goToBack(){
    this.navCtrl.back();
  }
}
