import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ActionSheetController, ModalController } from '@ionic/angular';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { City } from 'src/app/interfaces/city';
import { State } from 'src/app/interfaces/state';
import { Profile, ProfileCategory } from 'src/app/interfaces/profile';

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

  photo: string;
  form: FormGroup;
  city_name: string;
  states: State[] = [];
  cities: City[] = [];
  segment: string = 'info';
  profile = this.storage.getUser().profile;

  private camOptions: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  constructor(
    private camera: Camera,
    private api: ApiService,
    private webview: WebView,
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
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required]
    }, {validator: this.formValidator });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('state').then(res => {
      this.states = res;
      if(this.profile.address && this.profile.address.city){
        setTimeout(() => {
          this.form.get('state').setValue(this.profile.address.city.state.id);
        });
      }
    }).catch(_ => {});
    this.setValues();
    loader.dismiss();
  }

  formValidator(group: FormGroup) {
    let result:any = {};
    let name = group.get('name').value;
    let first_name = name.split(' ')[0];
    let last_name = name.split(' ')[1];

    if(!first_name || !last_name){
      result.notLastName = true;
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
  }

  async getCategories(){
    const loader = await this.functions.loading();
    await this.api.get('profile/category').then(res => {
      const user = this.storage.getUser();
      this.profile.categories = res;
      user.profile = this.profile;
      this.storage.setUser(user);
    }).catch(_ => {});
    loader.dismiss();
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
    this.photo = this.profile.photo;
    this.form.get('name').setValue(this.profile.first_name + ' ' + this.profile.last_name);
    this.form.get('email').setValue(this.profile.email);
    this.form.get('phone').setValue(this.profile.phone);
    this.form.get('cpf').setValue(this.profile.cpf);
    this.form.get('birthday').setValue(this.profile.birthday);
    this.form.get('zipcode').setValue(this.profile.address.zipcode);
    this.form.get('address').setValue(this.profile.address.address);
    this.form.get('district').setValue(this.profile.address.district);
    this.form.get('number').setValue(this.profile.address.number);
    this.form.get('complement').setValue(this.profile.address.complement);
  }

  checkStar(star: number, rating: number){
    return this.functions.nameStar(star, rating);
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      await this.api.patch('profile', data).then((res: Profile) => {
        const user = this.storage.getUser();
        user.profile = res;
        this.storage.setUser(user);
        this.functions.message('Perfil salvo!');
      }).catch(() => {})
      loader.dismiss();
    }else{
      let message = 'Verifique os dados antes de prosseguir!';
      if(this.form.hasError('notLastName')){
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

  isProfessional(){
    return this.profile.types == 'professional';
  }

  goToBack(){
    this.navCtrl.back();
  }
}
