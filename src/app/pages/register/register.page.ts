import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { City } from 'src/app/interfaces/city';
import { State } from 'src/app/interfaces/state';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  photo: string;
  form: FormGroup;
  states: State[] = [];
  cities: City[] = [];

  constructor(
    private camera: Camera,
    private api: ApiService,
    private webview: WebView,
    private navCtrl: NavController,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private functions: FunctionsService
  ) { 
    this.menuCtrl.enable(false);
    this.form = this.formBuilder.group({
      photo: [''],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      password: ['', Validators.required],
      confirmPass: ['', Validators.required],
    }, {validator: this.checkPasswords });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('state').then(res => {
      this.states = res;
    }).catch(_ => {});
    loader.dismiss();
  }

  async getCities(){
    const loader = await this.functions.loading();
    const state_id = this.form.get('state').value;
    await this.api.get('city/'+state_id).then(res => {
      this.cities = res;
    }).catch(_ => {});
    loader.dismiss();
  }

  async takePhoto(){
    const loader = await this.functions.loading();
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }

    await this.camera.getPicture(options).then(async (path) => {
      this.photo = null;
      this.form.get('photo').reset();
      this.photo = this.webview.convertFileSrc(path);
      const image:any = await this.functions.fileToBlob(path, 'image/png');
      this.form.get('photo').setValue(image.file);
    }).catch(_ => loader.dismiss());
    loader.dismiss();
  }

  checkPasswords(group: FormGroup) {
    let password = group.get('password').value;
    let confirmPass = group.get('confirmPass').value;
    return password === confirmPass ? null : { notSame: true }     
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Registrando-se...');
      const data = this.form.value;
      await this.api.post('register/profile', data).then((res: any) => {
        this.storage.setUser(res);
        this.menuCtrl.enable(true);
        this.navCtrl.navigateRoot('/service');
      }).catch(() => {})
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

}
