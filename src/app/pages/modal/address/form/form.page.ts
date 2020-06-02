import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { City } from 'src/app/interfaces/city';
import { State } from 'src/app/interfaces/state';
import { Global } from 'src/app/services/global';
import { ApiService } from 'src/app/services/api/api.service';
import { AddressService } from 'src/app/services/address/address.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-modal-address-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class AddressFormModal {

  form: FormGroup;
  city_name: string;
  cities: City[] = [];
  states: State[] = [];
  
  constructor(
    private global: Global,
    private api: ApiService,
    private address: AddressService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private functions: FunctionsService,
  ) {
    this.form = this.formBuilder.group({
      complement: [''],
      address: ['', Validators.required],
      zipcode: ['', Validators.required],
      district: ['', Validators.required],
      number: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    await this.api.get('state').then(res => {
      this.states = res;
    }).catch(_ => {});
    loader.dismiss();
  }

  async fetchAddres(){
    const zipcode = this.form.get('zipcode').value;
    if(zipcode.length == 9){
      const loader = await this.functions.loading();
      await this.address.searchAddress(zipcode).then(res => {
        this.city_name = res.localidade;
        const state = this.states.filter(state => state.uf == res.uf)[0];
        this.form.get('state').setValue(state.id);
        this.form.get('address').setValue(res.logradouro);
        this.form.get('district').setValue(res.bairro);
      }).catch(_ => {});
      loader.dismiss();
    }
  }

  async getCities(){
    const loader = await this.functions.loading();
    const state_id = this.form.get('state').value;
    await this.api.get('city/'+state_id).then(res => {
      this.cities = res;
      if(this.city_name){
        const city = this.cities.filter(city => city.name == this.city_name)[0];
        setTimeout(_ => {
          this.form.get('city').setValue(city.id);
        })
      }
    }).catch(_ => {});
    loader.dismiss();
  }

  async save(){
    const data = this.form.value;
    const city = this.cities.filter(city => city.id == data.city)[0];
    this.global.address = {
      zipcode: data.zipcode,
      address: data.address,
      number: data.number,
      district: data.district,
      city: city,
      complement: data.complement
    };
    this.close();
  }

  close(){
    this.modalCtrl.dismiss();
  }
}
