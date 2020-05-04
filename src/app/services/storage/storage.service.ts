import { Injectable } from '@angular/core';
import { Profile } from 'src/app/interfaces/profile';

export interface User {
  token: string;
  profile: Profile;
}

export interface Config {
  value: string;
  avaliation_days: number;
  no_interest_installment: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // USER
  setUser(data: User){
    localStorage.setItem('user', JSON.stringify(data));
  }
  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }
  removeUser(){
    localStorage.removeItem('user');
  }
  isAuthenticated(){
    if (this.getUser()) { return true }
    return false;
  }

  // PAYMENT METHOD
  setPayMethod(data: string){
    localStorage.setItem('pay-method', JSON.stringify(data));
  }
  getPayMethod(): string {
    return JSON.parse(localStorage.getItem('pay-method'));
  }
  removePayMethod(){
    localStorage.removeItem('pay-method');
  }

  // CONFIG
  setConfig(data: Config){
    localStorage.setItem('config', JSON.stringify(data));
  }
  getConfig(): Config {
    return JSON.parse(localStorage.getItem('config'));
  }
  removeConfig(){
    localStorage.removeItem('config');
  }
}
