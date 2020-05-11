import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

export interface Payment {
  
}

declare var PagSeguroDirectPayment: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public host = environment.pagseguro_host;
  private scriptURL = `${this.host}/pagseguro/api/v2/checkout/pagseguro.directpayment.js`;
  private scriptLoaded: boolean;

  constructor(
    private api: ApiService,
    private storage: StorageService,
  ) { }

  loadScript(){
    return new Promise((resolve) => {
      if(!this.scriptLoaded) {
        let script: HTMLScriptElement = document.createElement('script');
        script.addEventListener('load', async (_) => {
          await this.startSession();
          resolve()
        });
        script.src = this.scriptURL;
        document.head.appendChild(script);

        this.scriptLoaded = true;
      } else {
        console.debug('Script is already loaded. Skipping...');
        resolve();
      }
    });
  }

  private async startSession(){
    await this.api.get('pagseguro/get-session').then(data => {
      PagSeguroDirectPayment.setSessionId(data.session_id);
    }).catch(_ => {});
  }

  getPaymentMethods(){
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.getPaymentMethods({
        success: (res) => {
          resolve(res.paymentMethods);
        }, error: (res) => {
          reject(res);
        }
      });
    })
  }

  getCardBrand(number: number){
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.getBrand({
        cardBin: number,
        success: (response) => {
          resolve(response);
        },
        error: (response) => {
          reject(response);
        }
      });
    });
  }

  getInstallments(brand: any){
    return new Promise((resolve, reject) => {
      const config = this.storage.getConfig();
      PagSeguroDirectPayment.getInstallments({
        amount: config.value,
        brand: brand,
        maxInstallmentNoInterest: config.no_interest_installment,
        success: (response) => {
          resolve(response.installments[brand]);
        }, error: (response) => {
          reject(response);
        }
      });
    });
  }

  getCardToken(obj: any, cardName: string): Promise<string>{
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.createCardToken({
        cardNumber: obj.number,
        brand: cardName,
        cvv: obj.cvv,
        expirationMonth: obj.month,
        expirationYear: obj.year,
        success: (response) => {
          resolve(response.card.token)
        }, error: (response) => {
          reject(response);
        }
      });
    });
  }

  checkout(data: any){
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.onSenderHashReady((response) => {
        if(response.status == 'error') {
          reject(response.message);
        }
        data.sender_hash = response.senderHash;
        resolve(this.api.post('pagseguro/pay', data));
      });
    });
  }
}