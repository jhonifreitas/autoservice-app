import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private host = environment.host;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private storage: StorageService,
    private functions: FunctionsService
  ) { }

  get(endpoint: String, params?: any, reqOpts?: any): Promise<any> {
    if (!this.host) {
      this.disconect()
    }else{
      if (!reqOpts) {
        reqOpts = {
          headers: this.getHeaders(),
          params: new HttpParams()
        }
      }

      if (params) {
        reqOpts.params = new HttpParams()
        for (let k in params) {
          reqOpts.params = reqOpts.params.set(k, params[k])
        }
      }

      return new Promise((resolve, reject) => {
        this.http.get(this.host + endpoint + '/', reqOpts)
          .subscribe(res => {
            resolve(res)
          }, err => {
            this.showErrors(err)
            reject(err)
          })
      })
    }
  }

  post(endpoint: String, data: Object, reqOpts?: any): Promise<any> {
    if (!this.host) {
      this.disconect()
    }else{
      if (!reqOpts) {
        reqOpts = {
          headers: this.getHeaders()
        }
      }
      return new Promise((resolve, reject) => {
        this.http.post(this.host + endpoint + '/', this.convertToFormData(data), reqOpts)
          .subscribe(res => {
            resolve(res)
          }, err => {
            this.showErrors(err)
            reject(err)
          })
      })
    }
  }

  put(endpoint: String, data: Object, reqOpts?: any): Promise<any> {
    if (!this.host) {
      this.disconect()
    }else{
      if (!reqOpts) {
        reqOpts = {
          headers: this.getHeaders()
        }
      }

      return new Promise((resolve, reject) => {
        this.http.put(this.host + endpoint + '/', this.convertToFormData(data), reqOpts)
          .subscribe(res => {
            resolve(res)
          }, err => {
            this.showErrors(err)
            reject(err)
          })
      })
    }
  }

  patch(endpoint: String, data: Object, reqOpts?: any): Promise<any> {
    if (!this.host) {
      this.disconect()
    }else{
      if (!reqOpts) {
        reqOpts = {
          headers: this.getHeaders()
        }
      }

      return new Promise((resolve, reject) => {
        this.http.patch(this.host + endpoint + '/', this.convertToFormData(data), reqOpts)
          .subscribe(res => {
            resolve(res)
          }, err => {
            this.showErrors(err)
            reject(err)
          })
      })
    }
  }

  delete(endpoint: String, reqOpts?: any): Promise<any> {
    if (!this.host) {
      this.disconect()
    }else{
      if (!reqOpts) {
        reqOpts = {
          headers: this.getHeaders()
        }
      }

      return new Promise((resolve, reject) => {
        this.http.delete(this.host + endpoint, reqOpts)
          .subscribe(res => {
            resolve(res)
          }, err => {
            this.showErrors(err)
            reject(err)
          })
      })
    }
  }

  convertToFormData(data: Object): FormData {
    const formData = new FormData();
    for (let key in data) {
      let value = data[key];
      if(value instanceof Array){
        const list = this.convertList(key, value);
        for(let item of list){
          if(item.value instanceof Blob){
            const ext = item.value.type.split('/')[1];
            formData.append(item.key, item.value, 'file.'+ext);
          }else{
            if(item.value){
              formData.append(item.key, item.value);
            }else{
              formData.append(item.key, "");
            }
          }
        }
      }else if(value instanceof Blob){
        const ext = value.type.split('/')[1];
        formData.append(key, value, 'file.'+ext);
      }else{
        if(value){
          formData.append(key, value);
        }else{
          formData.append(key, "");
        }
      }
    }
    return formData;
  }

  convertList(defaultKey, value){
    let num = 0;
    const data = [];
    for(let item of value){
      if(item instanceof Blob){
        data.push({key: defaultKey+'['+num+']', value: item})
      }else{
        if(item instanceof Array){
          for (let key in item) {
            data.push({key: defaultKey+'['+num+']'+key, value: item[key]});
          }
        }else{
          data.push({key: defaultKey, value: item});
        }
      }
      num ++;
    }
    return data;
  }

  getHeaders(){
    let httpHeaders = new HttpHeaders();
    if (this.storage.getUser()) {
      httpHeaders = httpHeaders.append('Authorization', 'basic '+this.storage.getUser().token)
    }
    return httpHeaders
  }

  showErrors(err){
    if (err.status == 401) {
      this.disconect()
    }else{
      if (err.error && err.error.errors && err.error.errors.__all__) {
        for(let error of err.error.errors.__all__){
          this.functions.message(error);
        }
      } else if (err.error && err.error.error) {
        this.functions.message(err.error.error);
      } else {
        this.functions.message('Oops! Ocorreu algum erro.')
      }
    }
  }

  disconect(){
    this.storage.removeUser()
    this.navCtrl.navigateRoot('/login');
    this.functions.message('Usuário desconectado.')
  }
}
