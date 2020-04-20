import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Autonomous } from 'src/app/interfaces/autonomous';
import { ApiService } from 'src/app/services/api/api.service';
import { AutonomousService } from 'src/app/interfaces/autonomous';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-autonomous-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class AutonomousDetailPage {

  private id: number;
  private service_id: number;

  loading: boolean = true;
  object: Autonomous;
  service: AutonomousService;

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private functions: FunctionsService,
  ) {
    this.id = parseInt(this.router.snapshot.paramMap.get('id'));
    this.service_id = parseInt(this.router.snapshot.paramMap.get('service_id'));
  }

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('autonomous/'+this.id).then(data => {
      this.object = data;
    }).catch(() => {})
    this.service = this.object.services.filter(item => item.service.id == this.service_id)[0];
    if(event){ event.target.complete();}
    this.loading = false;
  }

  getAge(){
    var timeDiff = Math.abs(Date.now() - new Date(this.object.birthday).getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  }

  getStars(rating: string){
    return new Array(parseInt(rating))
  }

  is_star_half(rating: string){
    return parseFloat(rating) % 1 != 0;
  }

  formatDate(hour: string){
    const now = this.functions.formatDate(new Date(), 'yyyy-MM-ddT');
    return this.functions.formatDate(now+hour, 'HH:mm');
  }

  addAvaliation(){
    this.functions
  }

}
