import { Injectable } from '@angular/core';
import { Config } from 'src/app/interfaces/config';
import { Profile } from 'src/app/interfaces/profile';

export interface User {
  token: string;
  profile: Profile;
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

  // INTRO
  setIntro(data: boolean){
    localStorage.setItem('intro', JSON.stringify(data));
  }
  getIntro(): boolean {
    return JSON.parse(localStorage.getItem('intro'));
  }
  removeIntro(){
    localStorage.removeItem('intro');
  }
}
