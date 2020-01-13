import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

const Token_key = "";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authState$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor( private storage: Storage, private platform: Platform)
  {
    this.platform.ready().then( () => {
      this.checkToken();
    })
  }

  checkToken() {
    this.storage.get(Token_key).then( res => {
      if (res) {
        this.authState$.next(true);
      }
    })
  }

  login(token) {
    this.storage.set(Token_key, token).then( res => {
      this.authState$.next(true);
    })
  }

  logout() {
    this.storage.remove(Token_key).then( _ => {
      this.authState$.next(false);
    })
  }

  getAuthStateObserver(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  isAuthenticated() {
    return this.authState$.value;
  }

}
