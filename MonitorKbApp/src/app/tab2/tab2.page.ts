import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public alertController : AlertController) {}
  async alerta(){
  const alert = await this.alertController.create({
    header: ' O Que Deseja ? ',
    buttons:[],
  })
  await alert.present();
}
}

