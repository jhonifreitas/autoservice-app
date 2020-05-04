import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Address {
  bairro: string;
  cep: string;
  complemento: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  uf: string;
  unidade: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private http: HttpClient,
  ) { }

  async searchAddress(zipcode: string): Promise<Address> {
    return new Promise((resolve, reject) => {
      this.http.get(`http://viacep.com.br/ws/${zipcode}/json/`).subscribe((res: any) => {
        if(!res.erro){
          resolve(res);
        }
        reject();
      });
    });
  }
}
