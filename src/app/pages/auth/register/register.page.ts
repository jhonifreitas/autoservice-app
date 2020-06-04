import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { City } from 'src/app/interfaces/city';
import { State } from 'src/app/interfaces/state';
import { OneSignal } from '@ionic-native/onesignal/ngx';
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
    private oneSignal: OneSignal,
    private navCtrl: NavController,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private functions: FunctionsService
  ) { 
    this.menuCtrl.enable(false);
    this.form = this.formBuilder.group({
      photo: [''],
      name: ['', [Validators.required, this.validatorName]],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPass: ['', Validators.required],
    }, {validators: this.validatorPassword});
  }

  ngOnInit(){
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

  validatorName(name: FormControl) {
    const result:any = {};
    let value = name.value;
    let first_name = value.split(' ')[0];
    let last_name = value.split(' ')[1];

    if(!first_name || !last_name){
      result.invalid = true;
    }
    return result;
  }

  validatorPassword(group: FormGroup) {
    const result:any = {};
    let password = group.get('password').value;
    let confirmPass = group.get('confirmPass').value;

    if(password != confirmPass){
      result.passNotSame = true;
    }
    return result;
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Registrando-se...');
      const data = this.form.value;
      await this.oneSignal.getIds().then(res => {
        data.onesignal = res.userId;
      });
      await this.api.post('register', data).then((res: any) => {
        this.storage.setUser(res);
        this.menuCtrl.enable(true);
        this.navCtrl.navigateRoot('/home');
      }).catch(() => {})
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

  goToBack(){
    this.navCtrl.back();
  }

}
