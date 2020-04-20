import { Injectable } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

import { File } from "@ionic-native/file/ngx";


@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  EXTENSIONS = [
    'png',
    'jpg',
    'jpeg'
  ]

  constructor(
    private file: File,
    private date: DatePipe,
    private currency: CurrencyPipe,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) { }

  message(text, duration=4000, position=null) {
    this.toast.create({
      message: text,
      duration: duration,
      position: position || 'bottom'
    }).then(toast => toast.present())
  }

  alertConfirm(title='Atenção', msg='Deseja realizar esta ação?', btn_confirm='Aceitar', btn_cancel='Não Aceitar') {
    return new Promise((resolve, reject) => {
      this.alertCtrl.create({
        header: title,
        message: msg,
        buttons: [
          {
            text: btn_cancel,
            role: 'cancel',
            handler: () => reject()
          }, {
            text: btn_confirm,
            handler: () => resolve()
          }
        ]
      }).then(alert => alert.present());
    });
  }

  alertDelete(title='Atenção', msg='Deseja realizar esta ação?'){
    return new Promise((resolve, reject) => {
      this.alertCtrl.create({
        header: title,
        message: msg,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              reject(false)
            }
          }, {
            text: 'Apagar',
            cssClass: 'text-danger',
            handler: () => {
              resolve(true);
            }
          }
        ]
      }).then(alert => alert.present());
    });
  }

  async loading(text='Carregando...') {
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      message: text,
    });
    await loading.present();
    return loading;
  }

  convertToCurrency(value): string {
    return this.currency.transform(value, 'BRL', '').slice(1);
  }

  clearCurrency(value: string): number {
    return parseFloat(value.replace('.', '').replace(',', '.'));
  }

  formatDate(value: any, format: string): string {
    return this.date.transform(value, format);
  }

  dynamicColor(opacity:number = 1) {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ", " + opacity + ")";
  }

  isPhoto(path){
    const list = path.split('.')
    const ext = list[list.length - 1]
    return this.EXTENSIONS.indexOf(ext) !== -1
  }

  fileToBlob(_path: string, type: string) {
    return new Promise((resolve, reject) => {
      this.file
        .resolveLocalFilesystemUrl(_path)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          const imgBlob = new Blob([buffer], {
            type: type
          });
          resolve({file: imgBlob});
        })
        .catch(e => reject(e));
    });
  }
}
