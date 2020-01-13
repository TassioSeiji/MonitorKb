import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(private storage: Storage) { }
  public set(setValue, value) {
    return this.storage.set(setValue, value);
  }

  public async get(value) {
    return await this.storage.get(value);
  }

  public async remove(value) {
    return await this.storage.remove(value);
  }

  public clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }
}
