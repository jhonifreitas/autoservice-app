import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Week } from 'src/app/interfaces/week';
import { ActivatedRoute } from '@angular/router';
import { Service } from 'src/app/interfaces/service';
import { ApiService } from 'src/app/services/api/api.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-autonomous-service-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class AutonomousServiceFormPage implements OnInit {

  id: number;
  form: FormGroup;
  weeks: Week[] = [];
  types_pay: Week[] = [];
  services: Service[] = [];

  constructor(
    private api: ApiService,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private functions: FunctionsService
  ) {
    this.id = parseInt(this.router.snapshot.paramMap.get('id'));
    this.form = this.formBuilder.group({
      price: [''],
      week: [[], Validators.required],
      service: ['', Validators.required],
      end_hour: ['', Validators.required],
      type_pay: ['', Validators.required],
      start_hour: ['', Validators.required]
    });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('week').then(res => {
      this.weeks = res;
    }).catch(_ => {});
    await this.api.get('service').then(res => {
      this.services = res;
    }).catch(_ => {});
    await this.api.get('type-pay').then(res => {
      this.types_pay = res;
    }).catch(_ => {});
    if(this.id){
      await this.setValues()
    }
    loader.dismiss();
  }

  async setValues(){
    await this.api.get('profile/service/'+this.id).then(res => {
      const now = this.functions.formatDate(new Date(), 'yyyy-MM-ddT');
      this.form.get('price').setValue(res.price);
      this.form.get('week').setValue(res.week);
      this.form.get('service').setValue(res.service);
      this.form.get('end_hour').setValue(now+res.end_hour);
      this.form.get('type_pay').setValue(res.type_pay);
      this.form.get('start_hour').setValue(now+res.start_hour);
    }).catch(_ => {});
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      if(this.id){
        await this.api.put('profile/service/'+this.id, data).then(_ => {
          this.navCtrl.back();
          this.functions.message('Serviço salvo!');
        }).catch(() => {})
        loader.dismiss();
      }else{
        await this.api.post('profile/service', data).then(_ => {
          this.navCtrl.back();
          this.functions.message('Serviço salvo!');
        }).catch(() => {})
        loader.dismiss();
      }
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }

  async delete(){
    await this.functions.alertDelete().then(async _ => {
      const loader = await this.functions.loading('Removendo...');
      await this.api.delete('profile/service/'+this.id).then(_ => {
        this.navCtrl.back();
        this.functions.message('Serviço removido!')
      }).catch(_ => {});
      loader.dismiss();
    }).catch(_ => {})
  }

}
