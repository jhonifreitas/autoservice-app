import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { objectToFormData } from 'object-to-formdata/src';

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
    return objectToFormData(data, {indices: true});
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
