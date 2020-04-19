import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // USER
  setUser(data){
    localStorage.setItem('user', JSON.stringify(data));
  }
  getUser(){
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
