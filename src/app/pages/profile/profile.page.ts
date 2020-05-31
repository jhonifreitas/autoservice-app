import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ActionSheetController } from '@ionic/angular';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { City } from 'src/app/interfaces/city';
import { State } from 'src/app/interfaces/state';
import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  photo: string;
  form: FormGroup;
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
    private formBuilder: FormBuilder,
    private functions: FunctionsService,
    private actionSheetController: ActionSheetController
  ) {
    this.form = this.formBuilder.group({
      cpf: [''],
      photo: [''],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('state').then(res => {
      this.states = res;
      setTimeout(() => {
        this.form.get('state').setValue(this.profile.address.city.state.id);
      });
    }).catch(_ => {});
    this.setValues();
    loader.dismiss();
  }

  async getCities(){
    const loader = await this.functions.loading();
    const state_id = this.form.get('state').value;
    await this.api.get('city/'+state_id).then(res => {
      this.cities = res;
      setTimeout(() => {
        this.form.get('city').setValue(this.profile.address.city.id);
      });
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
    this.form.get('name').setValue(this.profile.name);
    this.form.get('email').setValue(this.profile.email);
    this.form.get('phone').setValue(this.profile.phone);
    this.form.get('cpf').setValue(this.profile.cpf);
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
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

  isProfessional(){
    return this.profile.types == 'professional';
  }

  goToBack(){
    this.navCtrl.back();
  }
}
