import { Injectable } from '@angular/core';
import { LoginPage } from 'src/app/pages/login/login.page';
import { ModalController } from '@ionic/angular';

@Injectable()
export class LoginModalService {
  public modal: any=null;
  constructor(public modalCtrl: ModalController)
  { }
  async loginModal() {
    this.modal = await this.modalCtrl.create({
      component: LoginPage,
    });
    return this.modal.present();
  }
}
