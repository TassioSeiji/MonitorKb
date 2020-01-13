import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, PopoverController, NavController, ModalController } from '@ionic/angular';
// import { UserService } from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public loading: any;
  public alert: any;
  public toast: any;
  public modal: any = null;
  public showLoading: boolean = true;
  public isLoading: boolean = false;
  public canLoad: boolean = true;
  public lottieConfig: any;
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public toastCtrl: ToastController, public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public modalController: ModalController) {
    this.lottieConfig = {
      path: '../../../../../assets/lottie/loader.json',
      autoplay: true,
      loop: true,
    };
  }

  async presentLoading(message, time = 3000): Promise<void> {
    if (this.canLoad && this.loading == null) {
      this.loading = await this.loadingCtrl.create({
        showBackdrop: false,
        message: message,
        spinner: 'crescent',
        animated: true,
        translucent: true,
        cssClass: 'loading',
        duration: time,
      });
      this.canLoad = false;
      this.loading.onDidDismiss().then(
        () => {
          this.loading = null;
          this.isLoading = false;
        }
      )
      return await this.loading.present();

    }
    else {
      if (this.loading) {
        this.loading.message = message;
      }

      return
    }

  }



  async dismissLoading(): Promise<void> {
    this.canLoad = true;
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  async presentAlert(header, message) {
    if (!this.alert) {
      this.alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.alert = null;
            },
            cssClass: 'secondary',
          }
        ]
      });
      return this.alert.present();
    }
  }

  async presentToast(message) {
    this.toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    this.toast.present();
  }

  toogleLoading(boolean: boolean) {
    this.dismissLoading();
    this.showLoading = boolean;
    console.log("toogleLoading", this.showLoading, boolean)
  }

  showError(error) {
    if (error == null) {
      this.presentAlert("Ocorreu um problema", "Sem conexão com a internet")
    } else {
      if (error.status == 0 || error.status == -1) {
        this.presentAlert("Ocorreu um problema", "Sem conexão com a internet")
      } else if (error.Error != "" && error.Error != null) {
        this.presentAlert("Ocorreu um problema", error.Error)
      } else if (error.statusText != "" && error.statusText != null) {
        this.presentAlert("Ocorreu um problema", error.statusText)
      } else if (error.ExceptionMessage != "" && error.ExceptionMessage != null) {
        this.presentAlert("Ocorreu um problema", error.ExceptionMessage)
      } else if (error.Message != null) {
        this.presentAlert("Ocorreu um problema", error.Message)
      } else {
        this.presentAlert("Ocorreu um problema", error)
      }

      if (error.status != null && error.status == 401 || error.IsBlocked) {
        this.presentToast("Você não está autorizado a realizar essa ação");
        // this.userService.logout();
        this.navCtrl.navigateRoot('/tabs/home');
        return;
      }
      if (error.IsFraud) {
        // MOSTRAR PAGINA DE FRAUDE
      }
    }

  };

  hideTabs() {
    const tabBar = document.getElementById('tabs');
    if (tabBar.style.display != 'none') tabBar.style.display = 'none';
  }

  showTabs() {
    const tabBar = document.getElementById('tabs');
    if (tabBar.style.display != 'flex') tabBar.style.display = 'flex';
  }

  FormatarCpfCnpj(valor) {
    if (valor.length === 11) {
      return this.mascaraCpf(valor);
    }
    else if (valor.length === 14) {
      return this.mascaraCnpj(valor);
    }
    else {
      return valor;
    }
  }

  private mascaraCpf(valor) {
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
  }
  private mascaraCnpj(valor) {
    return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
  }

}

