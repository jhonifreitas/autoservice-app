import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController, ActionSheetController, ModalController, Platform, IonContent } from '@ionic/angular';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geocoder, GeocoderResult } from '@ionic-native/google-maps/ngx';

import { City } from 'src/app/interfaces/city';
import { State } from 'src/app/interfaces/state';
import { Profile, ProfileCategory, Gallery, Review } from 'src/app/interfaces/profile';

import { CompetenceModal } from '../modal/competence/competence.page';
import { PaymentInfoModal } from 'src/app/pages/modal/payment/info/info.page';

import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddressService } from 'src/app/services/address/address.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonContent, {static: true}) content: IonContent;

  private city_name: string;
  private camOptions: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  photo: string;
  form: FormGroup;
  cities: City[] = [];
  states: State[] = [];
  reviews: Review[] = [];
  gallery: Gallery[] = [];
  loading: boolean = true;
  segment: string = 'info';
  object = this.storage.getUser().profile;

  constructor(
    private camera: Camera,
    private api: ApiService,
    private webview: WebView,
    private platform: Platform,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private storage: StorageService,
    private address: AddressService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
    private actionSheetController: ActionSheetController
  ) {
    this.form = this.formBuilder.group({
      cpf: [''],
      city: [''],
      photo: [''],
      state: [''],
      number: [''],
      zipcode: [''],
      address: [''],
      district: [''],
      birthday: [''],
      complement: [''],
      name: ['', [Validators.required, this.validatorName]],
      email: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('state').then(res => {
      this.states = res;
      if(this.object.address && this.object.address.city){
        setTimeout(() => {
          this.form.get('state').setValue(this.object.address.city.state.id);
        });
      }
    }).catch(_ => {});
    this.setValues();
    loader.dismiss();
    this.loading = false;
  }

  validatorName(name: FormControl) {
    let result:any = {};
    let value = name.value;
    let first_name = value.split(' ')[0];
    let last_name = value.split(' ')[1];

    if(!first_name || !last_name){
      result.invalid = true;
    }
    return result
  }

  async fetchAddres(){
    const zipcode = this.form.get('zipcode').value;
    if(zipcode.length == 9){
      const loader = await this.functions.loading();
      await this.address.searchAddress(zipcode).then(res => {
        this.city_name = res.localidade;
        const state = this.states.filter(state => state.uf == res.uf)[0];
        this.form.get('state').setValue(state.id);
        this.form.get('address').setValue(res.logradouro);
        this.form.get('district').setValue(res.bairro);
      }).catch(_ => {});
      loader.dismiss();
    }
  }

  async getCities(){
    const loader = await this.functions.loading();
    const state_id = this.form.get('state').value;
    await this.api.get('city/'+state_id).then(res => {
      this.cities = res;
      if(this.city_name){
        const city = this.cities.filter(city => city.name == this.city_name)[0];
        setTimeout(_ => {
          this.form.get('city').setValue(city.id);
        })
      }
    }).catch(_ => {});
    loader.dismiss();
    if(this.route.snapshot.paramMap.get('scroll')){
      this.content.scrollToBottom(500);
    }
  }

  async getCategories(){
    this.loading = true;
    await this.api.get('profile/category').then(res => {
      const user = this.storage.getUser();
      this.object.categories = res;
      user.profile = this.object;
      this.storage.setUser(user);
    }).catch(_ => {});
    this.loading = false;
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
        this.photo = null;
        this.form.get('photo').reset();
        this.photo = this.webview.convertFileSrc(path);
        const image:any = await this.functions.fileToBlob(path, 'image/png');
        this.form.get('photo').setValue(image.file);
      }).catch(_ => {});
      loader.dismiss();
    });
  }

  addGallery(){
    this.choiceMedia().then(async _ => {
      const loader = await this.functions.loading();
      await this.camera.getPicture(this.camOptions).then(async (path) => {
        const image:any = await this.functions.fileToBlob(path, 'image/png');
        const data = {
          image: image.file
        };
        this.api.post('gallery', data).then(res => {
          this.functions.message('Foto registrada!');
        }).catch(_ => {});
      }).catch(_ => {});
      loader.dismiss();
    });
  }

  setValues(){
    this.photo = this.object.photo;
    this.form.get('name').setValue(this.object.first_name + ' ' + this.object.last_name);
    this.form.get('email').setValue(this.object.email);
    this.form.get('phone').setValue(this.object.phone);
    this.form.get('cpf').setValue(this.object.cpf);
    this.form.get('birthday').setValue(this.object.birthday);
    this.form.get('zipcode').setValue(this.object.address.zipcode);
    this.form.get('address').setValue(this.object.address.address);
    this.form.get('district').setValue(this.object.address.district);
    this.form.get('number').setValue(this.object.address.number);
    this.form.get('complement').setValue(this.object.address.complement);
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      if(this.platform.is('cordova')){
        const city = this.cities.filter(city => city.id == data.city)[0];
        const address = data.address + ', ' +
                        data.number + ', ' +
                        data.district + ', ' +
                        city.name + ', ' +
                        city.state.name + ', ' +
                        'Brazil';
        await Geocoder.geocode({address: address}).then((results: GeocoderResult[]) => {
          if (results.length > 0) {
            data.lat = results[0].position.lat;
            data.lng = results[0].position.lng;
          }
        });
      }
      await this.api.patch('profile', data).then((res: Profile) => {
        const user = this.storage.getUser();
        user.profile = res;
        this.storage.setUser(user);
        this.functions.message('Perfil salvo!');
      }).catch(() => {})
      loader.dismiss();
    }else{
      let message = 'Verifique os dados antes de prosseguir!';
      if(this.form.get('name').hasError('invalid')){
        message = 'Nome deve conter nome e sobrenome!';
      }else if(this.form.get('email').hasError('required')){
        message = 'O campo Email é obrigatório!';
      }else if(this.form.get('phone').hasError('required')){
        message = 'O campo Telefone é obrigatório!';
      }
      this.functions.message(message);
    }
  }

  async openPaymentInfo(){
    const modal = await this.modalCtrl.create({
      component: PaymentInfoModal
    });
    return await modal.present();
  }

  async addCompetence(category: ProfileCategory = null){
    const modal = await this.modalCtrl.create({
      component: CompetenceModal,
      componentProps: {object: category}
    });
    await modal.present();
    await modal.onWillDismiss();
    this.getCategories();
  }

  checkStar(star: number, rating: number){
    return this.functions.nameStar(star, rating);
  }

  async changeSegment(){
    if(this.segment == 'avaliations'){
      await this.getAvaliations();
    }else if(this.segment == 'gallery'){
      await this.getGallery();
    }
  }

  isProfessional(){
    return this.object.types == 'professional';
  }

  goToBack(){
    this.navCtrl.back();
  }
}
