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
  selector: 'app-autonomous-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class AutonomousFormPage implements OnInit {

  photo: string;
  form: FormGroup;
  states: State[] = [];
  cities: City[] = [];
  autonomous = this.storage.getUser().autonomous;

  constructor(
    private camera: Camera,
    private api: ApiService,
    private webview: WebView,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private functions: FunctionsService
  ) {
    this.form = this.formBuilder.group({
      photo: [''],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      birthday: ['', Validators.required],
      about: ['', Validators.required]
    });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('state').then(res => {
      this.states = res;
      setTimeout(() => {
        this.form.get('state').setValue(this.autonomous.city.state.id);
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
        this.form.get('city').setValue(this.autonomous.city.id);
      });
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
      this.form.get('file').setValue(image.file);
    }).catch(_ => loader.dismiss());
    loader.dismiss();
  }

  setValues(){
    this.photo = this.autonomous.photo;
    this.form.get('name').setValue(this.autonomous.name);
    this.form.get('phone').setValue(this.autonomous.phone);
    this.form.get('birthday').setValue(this.autonomous.birthday);
    this.form.get('about').setValue(this.autonomous.about);
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      await this.api.put('autonomous/'+this.autonomous.id, data).then((res: any) => {
        const user = this.storage.getUser();
        user.autonomous = res;
        this.storage.setUser(user);
        this.functions.message('Perfil salvo!');
      }).catch(() => {})
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

}
