import { Injectable } from '@angular/core';
import { Profile } from 'src/app/interfaces/profile';
import { Autonomous } from 'src/app/interfaces/autonomous';

export interface User {
  token: string;
  profile: Profile;
  autonomous: Autonomous;
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
}
