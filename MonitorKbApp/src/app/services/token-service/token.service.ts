import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private userToken: string = "";

  constructor(private _http: HttpClient, private _storage: Storage) {
    this.getToken();
  }

  setToken(token) {
    this._storage.set("userToken", token);
    this.userToken = token;
  }

  getToken() {
    this._storage.get('userToken').then(
      token => {
        this.userToken = token;
      }
    )
    return this.userToken;
  }

  isActive() {
    this.getToken();
    if (this.userToken === null || this.userToken === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
