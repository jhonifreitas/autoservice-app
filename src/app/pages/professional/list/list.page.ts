import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Global } from 'src/app/services/global';
import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-professional',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class ProfessionalPage {

  private category_id: number;
  private select: boolean = true;

  loading: boolean = true;
  object_list: Profile[] = [];

  constructor(
    private global: Global,
    private api: ApiService,
    private navCtrl: NavController,
    private router: ActivatedRoute,
    private functions: FunctionsService
  ) {
    this.category_id = parseInt(this.router.snapshot.paramMap.get('category_id'));
    this.select = this.router.snapshot.paramMap.get('select') == 'true';
  }

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('category/'+this.category_id+'/professional').then(data => {
      this.object_list = data;
    }).catch(() => {})
    if(event){ event.target.complete();}
    this.loading = false;
  }

  checkStar(star: number, rating: number){
    return this.functions.nameStar(star, rating);
  }

  selectProfessional(professional: Profile){
    if(this.select){
      this.global.professional = professional;
      this.goToBack();
    }else{
      this.navCtrl.navigateForward('category/'+ this.category_id +'/professional/'+professional.id);
    }
  }

  goToBack(){
    this.navCtrl.back();
  }

}
