import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url, genericUser } from '../../../environments/environment'
import { TokenService } from '../token-service/token.service';
import { Events } from '@ionic/angular';
import { map, catchError } from 'rxjs/operators';
import { RequestService } from '../request-service/request.service';
import { UserService } from '../user-service/user.service';
import { Storage } from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class MonitorkbService {

  constructor(public events: Events ,public http: HttpClient,
    public storage: Storage, public tokenService: TokenService,
    public requestService: RequestService, public userService: UserService) { }

    obterDadosDoDia() {
      return this.requestService.get(`monitorKb/obterDadosDoDia`);
    }
    obterQuantidadeOcorrencias() {
      return this.requestService.get(`monitorKb/obterQuantidadeOcorrencias`);
    }

    baixaCriticidade(dataReferencia,codigoCriticidade, codigoTipoCritica){
      var body = {
        "dataReferencia" : new Date(dataReferencia),
        "codigoTipoCritica": codigoTipoCritica,
        "codigoCriticidade":codigoCriticidade
      }

      return this.requestService.post(`monitorKb/baixaCriticidade`, body);
    }

    reenviarNotificacao(dataReferencia,codigoCriticidade, codigoTipoCritica){
      let body = {
        "dataReferencia" : new Date(dataReferencia),
        "codigoTipoCritica": codigoTipoCritica,
        "codigoCriticidade":codigoCriticidade
      }

      return this.requestService.post(`monitorKb/reenviarNotificacao`, body);      
    }
} 
