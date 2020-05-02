import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-autonomous',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class AutonomousPage {

  private service_id: number;

  loading: boolean = true;
  object_list: Profile[] = [];

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
  ) {
    this.service_id = parseInt(this.router.snapshot.paramMap.get('service_id'));
  }

  async ionViewDidEnter(event=null){
    this.loading = true;
    await this.api.get('service/'+this.service_id+'/autonomous').then(data => {
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

}
