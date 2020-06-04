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

  private page = 1;
  private total: number;
  private select = true;
  private category_id: number;

  search: string;
  loading: boolean = true;
  object_list: Profile[] = [];

  constructor(
    private global: Global,
    private api: ApiService,
    private navCtrl: NavController,
    private router: ActivatedRoute,
    private functions: FunctionsService
  ) {
    this.search = this.router.snapshot.paramMap.get('search');
    this.select = this.router.snapshot.paramMap.get('select') == 'true';
    this.category_id = parseInt(this.router.snapshot.paramMap.get('category_id'));
  }

  async ionViewDidEnter(){
    this.loading = true;
    this.object_list = await this.getProfessional();
    this.loading = false;
  }

  async getProfessional(): Promise<Profile[]>{
    let data:any = {page: this.page}
    if(this.search){data.search = this.search}
    if(this.category_id){data.category_id = this.category_id}

    return new Promise(async (resolve) => {
      await this.api.get('professional', data).then(data => {
        this.total = data.count;
        resolve(data.results);
      }).catch(() => {})
    })
  }

  async refresh(event){
    this.page = 1;
    this.object_list = await this.getProfessional();
    if(event){ event.target.complete();}
  }

  async nextPage(event){
    if(!this.total || this.object_list.length < this.total){
      this.page += 1;
      const list = await this.getProfessional();
      this.object_list = this.object_list.concat(list);
      if(event){ event.target.complete();}
    }
    if(this.total == this.object_list.length){event.target.disabled = true;}
  }

  checkStar(star: number, rating: number){
    return this.functions.nameStar(star, rating);
  }

  selectProfessional(professional: Profile){
    if(this.select){
      this.global.professional = professional;
      this.goToBack();
    }else{
      this.navCtrl.navigateForward('/professional/'+professional.id);
    }
  }

  goToBack(){
    this.navCtrl.back();
  }

}
