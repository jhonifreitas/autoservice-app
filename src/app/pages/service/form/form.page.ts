import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';

import { AddressModal } from '../../modal/address/address.page';
import { DatetimeModal } from '../../modal/datetime/datetime.page';
import { ObservationModal } from '../../modal/observation/observation.page';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { Global } from 'src/app/services/global';
import { Address } from 'src/app/interfaces/address';
import { Category } from 'src/app/interfaces/category';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

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

  async ngOnInit(){
    this.loading = true;
    this.global.address = this.storage.getUser().profile.address;
    await this.api.get('category').then(data => {
      this.categories = data;
    }).catch(() => {})
    this.loading = false;
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
        if(this.global.observation){
          this.global.observation.images.push(data);
        }else{
          this.global.observation = {text: null, images: [data]};
        }
      }).catch(_ => {});
      loader.dismiss();
    });
  }

  removePhoto(index: number){
    this.functions.alertDelete('Atenção!', 'Deseja remover esta foto?').then(_ => {
      this.global.observation.images.splice(index, 1);
    }).catch(_ => {})
  }

  addProfessional(){
    if(this.global.category){
      const url = '/category/'+this.global.category.id;
      this.navCtrl.navigateForward([url, {select: true}]);
    }else{
      this.functions.message('Selecione uma categoria antes de selecionar o profissional!');
    }
  }
  
  addAddress(){
    this.openModal(AddressModal);
  }

  addDatetime(){
    this.openModal(DatetimeModal);
  }

  addObservation(){
    this.openModal(ObservationModal);
  }

  async openModal(Page){
    const modal = await this.modalCtrl.create({
      component: Page
    });
    return await modal.present();
  }

  async save(){
    if(this.validation()){
      const data = {
        category: this.global.category.id,
        professional: this.global.professional.id,
        address: this.global.address,
        datetime: this.global.datetime,
        observation: this.global.observation,
      }
      this.api.post('service', data).then(res => {
        this.functions.message('Serviço solicitado!');
      }).catch(_ => {})
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
    }else if(!this.global.datetime){
      this.functions.message('Selecione um data e hora!');
      return false;
    }
    return true;
  }

  goToBack(){
    this.navCtrl.back();
  }
}
