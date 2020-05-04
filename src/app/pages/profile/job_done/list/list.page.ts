import { Component } from '@angular/core';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-job-done',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class JobDonePage {

  loading: boolean = true;
  object_list: Service[] = [];

  constructor(
    private api: ApiService,
    private photoViewer: PhotoViewer,
    private functions: FunctionsService
  ) {}

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('job-done').then(data => {
      this.object_list = data;
    }).catch(_ => {})
    if(event){ event.target.complete();}
    this.loading = false;
  }

  showImage(image: string){
    this.photoViewer.show(image);
  }

  async delete(id: number){
    await this.functions.alertDelete().then(async _ => {
      const loader = await this.functions.loading('Removendo...');
      await this.api.delete('job-done/'+id).then(_ => {
        this.ionViewDidEnter();
        this.functions.message('Trabalho removido!')
      }).catch(_ => {});
      loader.dismiss();
    }).catch(_ => {})
  }
}
