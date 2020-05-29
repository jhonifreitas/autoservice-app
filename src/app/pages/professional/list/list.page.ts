import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-professional',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class ProfessionalPage {

  private category_id: number;

  loading: boolean = true;
  object_list: Profile[] = [];

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private router: ActivatedRoute,
  ) {
    this.category_id = parseInt(this.router.snapshot.paramMap.get('category_id'));
  }

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('service/'+this.category_id+'/autonomous').then(data => {
      this.object_list = data;
    }).catch(() => {})
    if(event){ event.target.complete();}
    this.loading = false;
  }

  getStars(rating: string){
    return new Array(parseInt(rating))
  }

  is_star_half(rating: number){
    return rating % 1 != 0;
  }

  goToBack(){
    this.navCtrl.back();
  }

}
