import { ActivatedRoute } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { IonContent, NavController, Platform } from '@ionic/angular';

import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Global } from 'src/app/services/global';
import { Service } from 'src/app/interfaces/service';
import { Category } from 'src/app/interfaces/category';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent, {static: true}) content: IonContent;

  slideOption = {
    slidesPerView: 'auto',
    spaceBetween: 10,
  };
  search: string;
  loading: boolean = true;
  histories: any[] = [];
  categories: Category[] = [];
  waiting_services: Service[] = [];
  approved_services: Service[] = [];
  historic_services: Service[] = [];
  requested_services: Service[] = [];

  constructor(
    public global: Global,
    private api: ApiService,
    private platform: Platform,
    private statusBar: StatusBar,
    private route: ActivatedRoute,
    public storage: StorageService,
    private navCtrl: NavController
  ) {}

  async ionViewDidEnter(event=null){
    this.loading = true;

    if(this.platform.is('cordova')){
      if(this.isProfessional()){
        this.statusBar.backgroundColorByHexString('#624AFC');
        this.statusBar.styleLightContent();
      }else{
        this.statusBar.backgroundColorByHexString('#E8EFFD');
        this.statusBar.styleDefault();
      }
    }

    if(this.isProfessional()){
      await this.api.get('service/approved').then(data => {
        this.approved_services = data;
      }).catch(() => {});
      await this.api.get('service/waiting').then(data => {
        this.waiting_services = data;
      }).catch(() => {});
    }else{
      await this.api.get('review/pending').then(data => {
        this.global.review_pending = data;
      }).catch(() => {});
      await this.api.get('category').then(data => {
        this.categories = data;
      }).catch(() => {});
      await this.api.get('service/requested').then(data => {
        this.requested_services = data;
      }).catch(() => {});
    }
    await this.api.get('service/history').then(data => {
      this.historic_services = data;
    }).catch(() => {});
    if(event){ event.target.complete();}
    this.loading = false;

    const elementScroll = this.route.snapshot.paramMap.get('scroll');
    if(elementScroll){
      const pointElement = document.getElementById(elementScroll).offsetTop;
      this.content.scrollToPoint(null, pointElement, 500);
    }
  }

  goToProfessional(){
    this.navCtrl.navigateForward(['/professional', {search: this.search}])
  }

  isProfessional(){
    return this.storage.getUser().profile.types == 'professional';
  }
}
