import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';

import { DatetimeModal } from '../../modal/datetime/datetime.page';
import { AddressFormModal } from '../../modal/address/form/form.page';
import { ObservationFormModal } from '../../modal/observation/form/form.page';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { Global } from 'src/app/services/global';
import { Address } from 'src/app/interfaces/address';
import { Category } from 'src/app/interfaces/category';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

declare var google;

@Component({
  selector: 'app-service-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class ServiceFormPage {

  slideOption = {
    slidesPerView: 'auto',
    spaceBetween: 10,
  };
  address: Address;
  loading: boolean = true;
  categories: Category[] = [];
  addressOption: string = 'current';

  private camOptions: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  constructor(
    public global: Global,
    private camera: Camera,
    private api: ApiService,
    private webview: WebView,
    private navCtrl: NavController,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
    private actionSheetController: ActionSheetController
  ) {
  }

  async ionViewDidEnter(){
    this.loading = true;
    this.global.address = this.storage.getUser().profile.address;
    if(this.global.professional){
      this.categories = this.global.professional.categories.map(category => category.category);
    }else{
      await this.api.get('category').then(data => {
        this.categories = data;
      }).catch(() => {})
    }
    if(this.global.address.lat && this.global.address.lng){
      this.loadMap();
    }
    this.loading = false;
  }

  loadMap(){
    const position = {lat: this.global.address.lat, lng: this.global.address.lng }
    const map = new google.maps.Map(document.getElementById("map"), {
      center: position,
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: 'none'
    });
    const marker = new google.maps.Marker({
      map: map,
      position: position,
      icon: {
        url: '/assets/icon/pointer.png',
        scaledSize : new google.maps.Size(24, 32),
      }
    });
  }

  async choiceMedia(){
    return new Promise((resolve, reject) => {
      this.actionSheetController.create({
        header: 'Escolha uma da opções',
        buttons: [
          {
            text: 'Galeria',
            role: 'destructive',
            icon: 'images',
            handler: () => {
              this.camOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
              resolve();
            }
          }, {
            text: 'Câmera',
            role: 'destructive',
            icon: 'camera',
            handler: () => {
              this.camOptions.sourceType = this.camera.PictureSourceType.CAMERA;
              resolve();
            }
          }
        ]
      }).then(action => action.present());
    });
  }

  takePhoto(){
    this.choiceMedia().then(async _ => {
      const loader = await this.functions.loading();
      await this.camera.getPicture(this.camOptions).then(async (path) => {
        const pathFile = this.webview.convertFileSrc(path);
        const image:any = await this.functions.fileToBlob(path, 'image/png');
        const data = {
          path: pathFile,
          file: image.file
        }
        this.global.images.push(data);
      }).catch(_ => {});
      loader.dismiss();
    });
  }

  removePhoto(index: number){
    this.functions.alertDelete('Atenção!', 'Deseja remover esta foto?').then(_ => {
      this.global.images.splice(index, 1);
    }).catch(_ => {})
  }

  addProfessional(){
    if(this.global.category){
      const param = {select: true, category_id: this.global.category.id};
      this.navCtrl.navigateForward(['/professional', param]);
    }else{
      this.functions.message('Selecione uma categoria antes de selecionar o profissional!');
    }
  }
  
  addAddress(){
    this.openModal(AddressFormModal);
  }

  addDatetime(){
    this.openModal(DatetimeModal);
  }

  addObservation(){
    this.openModal(ObservationFormModal);
  }

  async openModal(page: any){
    const modal = await this.modalCtrl.create({
      component: page
    });
    return await modal.present();
  }

  async save(){
    if(this.validation()){
      const loader = await this.functions.loading();
      const data = {
        category: this.global.category.id,
        professional: this.global.professional.id,
        lat: this.global.address.lat,
        lng: this.global.address.lng,
        zipcode: this.global.address.zipcode,
        city: this.global.address.city.id,
        address: this.global.address.address,
        district: this.global.address.district,
        number: this.global.address.number,
        complement: this.global.address.complement,
        date: this.global.date,
        time: this.global.time,
        observation: this.global.observation,
        images: this.global.images,
      }
      await this.api.post('service', data).then(res => {
        this.navCtrl.navigateBack('/home');
        this.functions.message('Serviço solicitado!');
      }).catch(_ => {})
      loader.dismiss();
    }
  }

  validation(){
    if(!this.global.category){
      this.functions.message('Selecione uma categoria!');
      return false;
    }else if(!this.global.professional){
      this.functions.message('Selecione um profissional!');
      return false;
    }else if(!this.global.address){
      this.functions.message('Selecione um endereço!');
      return false;
    }else if(!this.global.date || !this.global.time){
      this.functions.message('Selecione um data e horário!');
      return false;
    }
    return true;
  }

  goToBack(){
    this.navCtrl.back();
  }
}
