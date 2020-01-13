import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  public lottieConfig:any;
  public message: string="";

  constructor(public router:Router, public navParams: NavParams, public modalCtrl: ModalController)
  {
    this.lottieConfig = {
      path: '../../../../../assets/lottie/check-animation.json',
      autoplay: true,
      loop: false,
    }
  }
    
  ngOnInit(){
    this.message = this.navParams.data['message'];
  }
  
}
