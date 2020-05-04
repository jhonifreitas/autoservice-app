import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { ActivatedRoute } from '@angular/router';
import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-job-done-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class JobDoneFormPage implements OnInit {

  private id: number;

  image: string;
  form: FormGroup;
  services: Service[] = [];

  constructor(
    private camera: Camera,
    private api: ApiService,
    private webview: WebView,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private functions: FunctionsService
  ) {
    this.id = parseInt(this.router.snapshot.paramMap.get('id'));
    this.form = this.formBuilder.group({
      image: ['', Validators.required],
      service: ['', Validators.required],
    });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('service').then(res => {
      this.services = res;
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
      this.removeFile()
      this.image = this.webview.convertFileSrc(path);
      const image:any = await this.functions.fileToBlob(path, 'image/png');
      this.form.get('image').setValue(image.file);
    }).catch(_ => loader.dismiss());
    loader.dismiss();
  }

  removeFile(){
    this.image = null;
    this.form.get('image').reset();
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      await this.api.post('job-done', data).then(_ => {
        this.navCtrl.back();
        this.functions.message('Trabalho salvo!');
      }).catch(() => {})
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

}
