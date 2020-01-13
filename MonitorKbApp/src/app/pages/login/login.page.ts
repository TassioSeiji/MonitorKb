import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, NavController, MenuController, AlertController, ToastController, Events, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user-service/user.service';
import { TokenService } from 'src/app/services/token-service/token.service';
import { AppService } from 'src/app/services/app-services/app.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/core/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal-service/modal.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { captchaSiteKey } from '../../../environments/environment';
import { genericUser } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [UserService, AppService]
})

export class LoginPage implements OnInit {
  authState$: Observable<boolean>;

  private captchaPassed: boolean = false;
  private captchaResponse: string;
  captchaSiteKey: string = captchaSiteKey;
  
  public loginForm: FormGroup;
  public loading: any;
  public userPrograms: []=[];
  public user = {
    username: "",
    token:"",
  }

  constructor(public formBuilder: FormBuilder, public userService: UserService,
              public loadingCtrl: LoadingController, public navCtrl: NavController,
              public menuCtrl: MenuController, public storage: Storage,
              public alertCtrl: AlertController, 
              public toastCtrl: ToastController, private _tokenService: TokenService,
              public appService: AppService, public authService: AuthService,
              public router: Router, public events:Events,
              public modalCtrl: ModalController,
              // Circular dependendencies question, how to deal with it?
              public modalService: ModalService,
              public spinnerDialog: SpinnerDialog,
              private zone: NgZone
              )
  {
    this.loginForm = formBuilder.group({
      user: [""],
      password: [""]
    })
  }

  ngOnInit() {
    this.authState$ = this.authService.getAuthStateObserver();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.userPrograms=[];
    this.menuCtrl.enable(true);
  }

  captchaResolved(response: string): void {

    this.zone.run(() => {
        this.captchaPassed = true;
        this.captchaResponse = response;
    });

}

  login() {
    if(this.loginForm.value.user==''||this.loginForm.value.user==null||this.loginForm.value.user==undefined){
      this.appService.presentAlert("Login","Preencha o campo usuÃ¡rio");
    }else if(this.loginForm.value.password==''||this.loginForm.value.password==null||this.loginForm.value.password==undefined){
      this.appService.presentAlert("Login","Preencha o campo senha");
    }else{
      this.logOn("BRBAY");
    }
  }

  logOn(campaingId){
    // this.userService.campaignId=campaingId;
    this.userService.loginUser(this.loginForm.value).subscribe(
      data => {
        if(data["Error"]){
          this.appService.presentAlert("Ocorreu um problema", data["Error"])
        }
        else{
            this.storage.set('currentUser',data["Result"]["Customer"]);
            this.userService.setUser(data["Result"]["Customer"]);
            this.events.publish("user:created",data["Result"]["Customer"]);
            this.modalCtrl.dismiss({success:true});        
        }
      },
      error => {
        this.appService.dismissLoading();
        this.appService.presentAlert("Usuário ou Senha Inválidos", error.error["ExceptionMessage"])
      },
    )
  }

  signUp() {
    // this._iab.create("https://login.redeagroservices.com.br/Cadastre-se","_blank"); 
  }

  forgotPassword() {
    if(this.loginForm.value.user == ""){
      this.appService.presentAlert("Recuperar senha","Preencha o campo usuÃ¡rio");
    }else{
      this.storage.set('username', this.user.username);
      this.appService.presentLoading("Enviando email");
      this.userService.forgotPassword(this.loginForm.value,"BRBAY").subscribe(
        success => {
          this.appService.presentToast("Email enviado com sucesso!")
        },
        error =>{
          this.appService.dismissLoading();
          this.appService.showError(error)
        },
      )
    }
  }

  return(){
    this.userPrograms=[];
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  registerPerson(){
    this.modalCtrl.dismiss();
    this.appService.hideTabs();
    this.router.navigate(['tabs/tools/register-person', {
      registro: 'pessoa'      
  }]);
  }
}