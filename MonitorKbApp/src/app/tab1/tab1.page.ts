import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MonitorkbService } from 'src/app/services/monitorkb-service/monitorkb.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  dadosDoDia = [];
  produtoContabil = [];
  dadosFiltrados = [];
  totalCriticidadeTodas = 0;
  totalCriticidadeAlta = 0;
  totalCriticidadeMedio = 0;
  totalCriticidadeFraco = 0;
  idCriticidadeAlta = 1;
  idCriticidadeMedia = 2;
  idCriticidadeBaixa = 3;
  idCriticidadeTodos = 5;
  armazenarCalculoTotalCriticidade = 0;
  codigoTipoCritica: any[];
  dataReferencia: any[];
  codigoCriticidade: any[];
  dadosFiltradosSelect: any[];
  currentTipoControle = "";

  constructor(public router: Router, public monitorkbService: MonitorkbService, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.carregarDadosDia();
  }

  carregarDadosDia() {
      this.monitorkbService.obterDadosDoDia().subscribe(value => {
      this.dadosDoDia = value.DadosDoDia || [];
      this.produtoContabilComparador('Produto Contábil');  
    });
  }

  calcularTotalPorCriticidade(idCriticidade) {
    var count = this.dadosFiltrados.filter((obj) => obj.nCodCriticidade === idCriticidade);
    var i = 0;
    var total = 0;

    for (i = 0; i < count.length; i++) {
      total = total + parseInt(count[i].nQtdeOcorrencias);
    }
    
    return total;    
  }
  
   produtoContabilComparador(tipoControle) {
    this.currentTipoControle = tipoControle;
    this.dadosFiltrados = this.dadosDoDia.filter((obj) => obj.sTipoControle === tipoControle)
    document.getElementById("lblTotalCriticidadeAlta").innerHTML = this.calcularTotalPorCriticidade(this.idCriticidadeAlta).toString();
    document.getElementById("lblTotalCriticidadeMedia").innerHTML = this.calcularTotalPorCriticidade(this.idCriticidadeMedia).toString();
    document.getElementById("lblTotalCriticidadeBaixa").innerHTML = this.calcularTotalPorCriticidade(this.idCriticidadeBaixa).toString();
    this.armazenarCalculoTotalCriticidade = (this.calcularTotalPorCriticidade(this.idCriticidadeAlta) + this.calcularTotalPorCriticidade(this.idCriticidadeMedia) + this.calcularTotalPorCriticidade(this.idCriticidadeBaixa));
    document.getElementById("lblTotalCriticidadeTotal").innerHTML = this.armazenarCalculoTotalCriticidade.toString();
  }

  public async modalBaixaReenviar(dDataRef,nCodTipoCritica,nCodCriticidade){ 
    const alert = await this.alertCtrl.create({
      header: 'O Que Você Deseja',
      buttons: [
        {
          text: 'Baixar',
          handler: () => {
            this.dataReferencia = dDataRef;
            this.codigoCriticidade = nCodCriticidade;
            this.codigoTipoCritica = nCodTipoCritica
            console.log(this.baixaCriticidade());}
        },
        {
          text: 'Reencaminhar',
          handler: () => {
            this.dataReferencia = dDataRef;
            this.codigoCriticidade = nCodCriticidade;
            this.codigoTipoCritica = nCodTipoCritica
            console.log(this.reencaminhaCriticidade())
          }
        }
      ]
    });

    await alert.present();
  }
  cobranca() {
    this.router.navigate(['tabs', 'tab2', {
    }]);  
  }

  async filtroSelecaoCriticidade(selecaoValor){
      this.produtoContabilComparador(this.currentTipoControle);
      if(parseInt(selecaoValor.detail.value) !== this.idCriticidadeTodos){
        this.dadosFiltrados = this.dadosFiltrados.filter((obj) => obj.nCodCriticidade === parseInt(selecaoValor.detail.value))  
      }               
  }

  baixaCriticidade(){
    this.monitorkbService.baixaCriticidade(this.dataReferencia, this.codigoCriticidade, this.codigoTipoCritica).subscribe(
      data => {     
        this.carregarDadosDia();
      },
      error => {
        alert("Não foi possível baixar a criticidade.");        
      },
      () => {        
        console.log("ACABEI")
      }
    )   
  }
 reencaminhaCriticidade(){
  this.monitorkbService.reenviarNotificacao(this.dataReferencia, this.codigoCriticidade, this.codigoTipoCritica).subscribe(
    data => {             
    },
    error => {
      alert("Não foi possível reenviar.");        
    },
    () => {        
      console.log("ACABEI")
    }
  )   
 }       
}
