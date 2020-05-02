import { Injectable } from '@angular/core';
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
}
