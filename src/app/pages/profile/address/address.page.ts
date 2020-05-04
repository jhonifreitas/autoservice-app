import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Profile } from 'src/app/interfaces/profile';
import { ApiService } from 'src/app/services/api/api.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddressService } from 'src/app/services/address/address.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  private profile: Profile;

  form: FormGroup;
  payment: boolean = false;

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private router: ActivatedRoute,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private addressApi: AddressService,
    private functions: FunctionsService
  ) {
    this.form = this.formBuilder.group({
      complement: [''],
      number: ['', Validators.required],
      zipcode: ['', Validators.required],
      address: ['', Validators.required],
      district: ['', Validators.required],
    });
    if(this.router.snapshot.paramMap.get('payment')){
      this.payment = true;
    }
  }

  async ngOnInit(){
    const loader = await this.functions.loading();
    this.setValues();
    loader.dismiss();
  }

  setValues(){
    this.profile = this.storage.getUser().profile;
    this.form.get('number').setValue(this.profile.number);
    this.form.get('zipcode').setValue(this.profile.zipcode);
    this.form.get('address').setValue(this.profile.address);
    this.form.get('district').setValue(this.profile.district);
    this.form.get('complement').setValue(this.profile.complement);
  }

  async getZipCode(){
    const loader = await this.functions.loading();
    const zipcode = this.form.get('zipcode').value.replace('-', '')
    await this.addressApi.searchAddress(zipcode).then(res => {
      this.form.get('district').setValue(res.bairro);
      this.form.get('address').setValue(res.logradouro);
    }).catch(_ => {
      this.functions.message('CEP não encontrado!');
    });
    loader.dismiss();
  }

  async save(){
    if(this.form.valid){
      const loader = await this.functions.loading('Salvando...');
      const data = this.form.value;
      await this.api.patch('profile', data).then((res: any) => {
        const user = this.storage.getUser();
        user.profile = res;
        this.storage.setUser(user);
        this.functions.message('Endereço salvo!');
        if(this.payment){
          let page = '/payment/confirm';
          if(this.storage.getPayMethod() == 'credit_card'){
            page = '/payment/card';
          }
          this.navCtrl.navigateForward(page);
        }
      }).catch(() => {})
      loader.dismiss();
    }else{
      this.functions.message('Verifique os dados antes de prosseguir!');
    }
  }
}
