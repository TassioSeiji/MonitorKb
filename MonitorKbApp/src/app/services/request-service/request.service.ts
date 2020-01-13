import { Injectable } from '@angular/core';
import { UserService } from '../user-service/user.service';
import { AppService } from 'src/app/services/app-services/app.service';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url, genericUser, campaignIdMkt } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { Events, ModalController, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { ModalService } from '../modal-service/modal.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  public token: string;
  public user:any=genericUser;
  public userId:string;
  public location = null;

  constructor(public http: HttpClient, public userService: UserService,
              public events: Events, public appService: AppService, public router:Router,
              public modalService: ModalService, public modalCtrl: ModalController,
              private navCtrl: NavController,  public storage: StorageService
              )
  { 
    this.storage.get("location").then((val) => {
      console.log('get ', val);
      this.location = val;
    }).catch((error) => {
      console.log(error);
    });
    
    events.subscribe('changeLocation', (location) => {
      this.location = location;
    });

    events.subscribe("user:created",
    user=>{
      if(user){
        this.user=user;
      }else{
        this.user=genericUser
      }
    });
    this.user=this.userService.getUser();    
  }

  // Requisição pura
  getRequest(endpoint){
    let urlEndpoint = url + endpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.get(urlEndpoint,{headers})
  }

  // Requisição com tratamento de erros
  get(endpoint, showLoading = true):Observable<any>{
    if (showLoading)
      this.appService.presentLoading("Carregando");
    let urlEndpoint = url + endpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.get(urlEndpoint,{headers})
    .pipe(map(
      response=>{
        if (showLoading)
          this.appService.dismissLoading()
        return response
      }
    ),catchError(
      error=>{
        if (showLoading)
          this.appService.dismissLoading();
        this.responseFilter(error,"")
        console.log("request service", error)
        return error
      }
    ))
  }

  // Requisição com tratamento de erros
  getMkt(endpoint, showLoading = true):Observable<any>{
    if (showLoading)
      this.appService.presentLoading("Carregando");
    let urlEndpoint = url + campaignIdMkt  + endpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.get(urlEndpoint,{headers})
    .pipe(map(
      response=>{
        if (showLoading)
          this.appService.dismissLoading()
        return response
      }
    ),catchError(
      error=>{
        if (showLoading)
          this.appService.dismissLoading();
        this.responseFilter(error,"")
        console.log("request service", error)
        return error
      }
    ))
  }

  getId(endpoint):Observable<any>{
    this.appService.presentLoading("Carregando");
    let urlEndpoint = url + endpoint + this.user.Id;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.get(urlEndpoint,{headers})
    .pipe(map(
      response=>{
        this.appService.dismissLoading()
        return response
      }
    ),catchError(
      error=>{
        this.appService.dismissLoading()
        console.log("request service", error)
        return error
      }
    ))
  }

  getIdMarketplace(endpoint):Observable<any>{
    let urlEndpoint = url +  campaignIdMkt + endpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    if(this.location != null){
      headers = headers.set("HMPT_IBGEArea", this.location.IBGE);
    }
    return this.http.get(urlEndpoint,{headers})
    .pipe(map(
      response=>{
        this.appService.dismissLoading()
        return response;
      }
    ),catchError(
      error=>{
        console.log("request service", error);
        return error;
      }
    ))
  }

  postId(endpoint, body){
    this.appService.presentLoading("Carregando");
    let urlEndpoint = url + endpoint + this.user.Id;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.post(urlEndpoint,body,{headers})
    .pipe(map(
      response=>{
        this.appService.dismissLoading()
        if(response["Error"]){
          this.showError(response["Error"])
        }
        console.log("request service", response)
        return response
      }
    ),catchError(
      error=>{
        this.appService.dismissLoading()
        console.log("request service", error)
        return error
      }
    ))
  }

  post(endpoint, body){
    this.appService.presentLoading("Carregando");
    let urlEndpoint = url + endpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.post(urlEndpoint,body,{headers})
    .pipe(map(
      response=>{
        this.appService.dismissLoading()
        return this.responseFilter(response,body)
      }
    ),catchError(
      error=>{
        this.appService.dismissLoading()
        console.log("request service error", error)
        return error
      }
    ))
  }

  postMkt(endpoint, body){
    this.appService.presentLoading("Carregando");
    let urlEndpoint = url +  campaignIdMkt + endpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.post(urlEndpoint,body,{headers})
    .pipe(map(
      response=>{
        this.appService.dismissLoading()
        return this.responseFilter(response,body)
      }
    ),catchError(
      error=>{
        this.appService.dismissLoading()
        console.log("request service error", error)
        return error
      }
    ))
  }

  addToCart(endpoint, body,redirect){
    this.appService.presentLoading("Adicionando ao carrinho");
    let urlEndpoint = url + endpoint;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.post(urlEndpoint,body,{headers})
    .pipe(map(
      response=>{
        return this.responseFilterAddCart(response,redirect,body, () => {
            this.addToCart(endpoint, body, redirect).subscribe();
        });
      }
    ),catchError(
      error=>{
        this.appService.dismissLoading()
        console.log("request service error", error)
        return error
      }
    ))
  }

  getDocumentTerm(type){
    let urlEndpoint = url + 'account/'+ type +'/' + this.user.Id + '/true';
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('HomepointTK', this.user.Token);
    return this.http.get(urlEndpoint,{headers})
  }

  postFile(endpoint, file: File) {
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);

    let headers = new HttpHeaders().set('HomepointTK', this.user.Token);

    return this.http.post(url + endpoint, formData, { headers: headers })
      .pipe(map(
        response=>{
          return this.responseFilter(response,null);
        }
      ),catchError(
        error=>{
          console.log("request service error", error)
          return error
        }
      ));
  }

  responseFilterAddCart(response,redirect,body, retry){
    console.log("resposta", response)
    this.appService.presentLoading("Adicionando ao carrinho");
    if(response['LoyaltyNaoAceito'] != null){
      this.modalCtrl.create({
        component: "",
        animated: true,
        cssClass: 'modal-large',
        componentProps: {
          regulamentosNaoAceitos: [],
          loyaltyNaoAceito: response["LoyaltyNaoAceito"],
          commit: retry
        }
      }).then(modal => {
        return modal.present();
      })

      return;
    }
    else if(response['ClassName']=="TecUnica.Core.Model.ValidationException"){
      this.appService.dismissLoading()
      this.appService.presentAlert("Ocorreu um problema",response['Message']);
      return
    }
    else if(response['ClassName']=="TecUnica.Core.Data.DataAccessException"){
      this.appService.dismissLoading()
      this.appService.presentAlert("Ocorreu um problema",response['Message']);
      return
    }
    else if(response['ClassName']=="System.ApplicationException"){
      this.appService.dismissLoading()
      this.appService.presentAlert("Ocorreu um problema",response['Message']);
      return
    }
    else if(response["Error"]){
      this.appService.dismissLoading()
      this.showError(response["Error"])
    }
    else{
      this.appService.dismissLoading();
      this.appService.toogleLoading(false);
      
      /*
      this.modalService.successModal("Adicionado com sucesso").then(
        ()=>{
          setTimeout(() => {
            this.modalCtrl.dismiss();
          }, 2000);
          if(redirect=='shoppingCart'){
            let navigationExtras: NavigationExtras = {
              queryParams: {
                special: body.CartId
              }
            };
            this.router.navigate(['tabs/shop-cart'], navigationExtras);
          }else{
            this.navCtrl.back();
          } 
        }
      )
      */
      

      this.router.navigate(['tabs/home/shop-cart']);

      return response;
    }
  } 

  responseFilter(response,body){
    console.log(response,"resposta")
    if(response['ClassName']=="TecUnica.Core.Model.ValidationException"){
      this.appService.presentAlert("Ocorreu um problema",response['Message']);
      return
    }
    else{
      if(response["Error"]){
      this.showError(response["Error"])
      }
      else{
        return response
      }
    }
  } 

  showError(error){
    this.appService.presentAlert("Ocorreu um problema",error);
  }
}
