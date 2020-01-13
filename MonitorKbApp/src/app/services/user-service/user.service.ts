import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url, genericUser } from '../../../environments/environment'
import { Storage } from '@ionic/storage';
import { TokenService } from '../token-service/token.service';
import { Events } from '@ionic/angular';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  public campaignId: string="BRBAY";
  public IsRedistributor: boolean=false;
  public user: any=genericUser;
  public userId: any=0;
  public userCart:any;
  constructor(public events: Events ,public http: HttpClient,
              public storage: Storage, public tokenService: TokenService)
  {
    events.subscribe("user:created",
    user=>{
      this.setUser(user)
    });
  }

  loginUser(userData) {
    return this.http.post(url + "auth/authenticate/", {
      "AppId": "bra_brbay_1729",
      "CampaignId": this.campaignId,
      "UserId": userData.user,
      "Password": userData.password,
      "TokenPush": ""
    })
  }

  loginUserBayer(userData){
    return this.http.post(url + "auth/tokenBayer/", {
      "AppId": "bra_brbay_1729",
      "CampaignId": "BRBAY",
      "UserId": userData.user,
      "Password": userData.password,
    })
  }

  forgotPassword(userData, campaignId){
    var email = String(userData.user);
    return this.http.post(url+"auth/forgot/", {
      "CampaignId": campaignId,
      "Email":email 
    })
  }

  setUser(user){
    if(!user){
      this.user=genericUser
    }else{
      this.user = user;
      if(user.Id!=0){
        this.storage.set("currentUser",user);
        this.userId = user.Id;
        this.tokenService.setToken(user["Token"]);        
      }
    }
  }

  triggerUserCreated(){
    this.events.publish("user:created", this.user);
  }

  getUserId():Promise<any>{
    return this.user.Id
  }

  getUserService():Observable<any>{
    return this.user
  }

  getUser(){
    if(!this.user){
      this.setUser(genericUser)
      return genericUser
    }
    return this.user
  }

  updateScore(){
    if(this.user.Id!=0){
        let urlEndpoint = url + this.user.CampaignId + '/account/getScore/' + this.user.Id;
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        headers = headers.set('HomepointTK', this.user.Token);
        return this.http.get(urlEndpoint,{headers})
        .pipe(map(
          response=>{
            if(response['Score']){
              this.events.publish("updateScore",response['Score'])
            }
            
            return response
          }
        ),catchError(
          error=>{
            return error
          }
        ))
      
    }
  }

  updateUser(){
    // .get($rootScope.url + $rootScope.campaignId + '/account/getScore/' + $rootScope.currentUser.Id);
  }

  logout(){
    this.storage.set('currentUser',genericUser);
    sessionStorage.clear();
    this.user = genericUser
  }

  
}