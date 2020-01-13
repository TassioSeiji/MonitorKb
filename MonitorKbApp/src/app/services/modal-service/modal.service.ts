import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SuccessPage } from 'src/app/pages/success/success.page';

@Injectable()
export class ModalService {
  public modal: any=null;
  constructor(public modalCtrl: ModalController)
  { }

  async successModal(message) {
    this.modal = await this.modalCtrl.create({
      component: SuccessPage,
      componentProps: {
        message: message
      },
    })
    return this.modal.present();
  }

  closeModal() {
    console.log("Fechar Modal")
    this.modalCtrl.dismiss();
    this.modal=null
  }

}


