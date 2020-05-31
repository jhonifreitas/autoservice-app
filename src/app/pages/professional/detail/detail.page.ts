import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Platform, NavController } from '@ionic/angular';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { ApiService } from 'src/app/services/api/api.service';
import { AvaliationPage } from '../avaliation/avaliation.page';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Profile, ProfileCategory, Review } from 'src/app/interfaces/profile';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-professional-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class ProfessionalDetailPage {

  private id: number;
  private category: ProfileCategory;
  private category_id: number;

  segment: string = 'avaliations';
  object: Profile;
  loading: boolean = true;

  constructor(
    private api: ApiService,
    private platform: Platform,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private storage: StorageService,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
    private socialSharing: SocialSharing,
  ) {
    this.id = parseInt(this.router.snapshot.paramMap.get('id'));
    this.category_id = parseInt(this.router.snapshot.paramMap.get('category_id'));
  }

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('autonomous/'+this.id+'/detail').then(data => {
      this.object = data;
    }).catch(() => {})
    this.category = this.object.categories.filter(item => item.category.id == this.category_id)[0];
    if(event){ event.target.complete();}
    this.loading = false;
  }

  checkStar(star: number, rating: number){
    return this.functions.nameStar(star, rating);
  }

  canAddAvaliation(){
    const user = this.storage.getUser();
    if(this.isAutonomous()){
      return false;
    }else if(this.object.reviews.filter(review => review.from_profile.id == user.profile.id).length){
      return false;
    }
    return true;
  }

  async openAvaliation(review: Review = null){
    if(this.isAutonomous()){
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
                        'seu serviço de '+this.category.category.name+'. Obrigado.';
    if(this.platform.is('ios')){
      window.location.href = 'https://wa.me/55'+this.object.phone+'?text='+msgWhatsapp;
    }else{
      this.socialSharing.shareViaWhatsAppToReceiver('+55'+this.object.phone, msgWhatsapp);
    }
  }

  showImage(image: string){
    this.photoViewer.show(image);
  }

  isAutonomous(){
    return this.storage.getUser().profile.types == 'autonomous';
  }

  goToBack(){
    this.navCtrl.back();
  }
}
