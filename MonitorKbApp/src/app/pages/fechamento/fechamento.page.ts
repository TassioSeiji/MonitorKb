import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MonitorkbService } from 'src/app/services/monitorkb-service/monitorkb.service';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-fechamento',
  templateUrl: './fechamento.page.html',
  styleUrls: ['./fechamento.page.scss'],
})
export class FechamentoPage implements OnInit {
  fechamentoBloqueado = '';
  fechamentos = [];
  dataCompetencia: any;
  dataInicio: any;
  dataFim: any;
  sNome: any;
  styles = {
    backgroundColor : "#fff",
    fontWeight: "600px"
  };
 
  constructor(public router: Router, public monitorkbService: MonitorkbService, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.carregarFechamentos();
  }
  fechamentoAbrir() {
    this.router.navigate(['fechamento', {
    }]);
  }

  voltarMenu() {
    this.router.navigate(['tabs', 'tab1', {
    }]);
  }
  carregarFechamentos() {
    this.monitorkbService.obterFechamento().subscribe(value => {
    this.fechamentos = value.Fechamentos || [];
     
    });

  }
  
  public async modalFechamento(dCompetencia, dInicio, dFim,sNomeFechamento) {

    this.sNome = sNomeFechamento;
    const alert = await this.alertCtrl.create({
      header: 'Deseja Bloquear o Processo ' + this.sNome +  '?', 
      buttons: [
        {
          text: 'Sim',
          handler: () => {
           this.dataCompetencia = dCompetencia;
           this.dataInicio = dInicio;
           this.dataFim = dFim;
           console.log(this.bloquearFechamento());
          }
        },
        {
          text: 'Não',
          handler: () => {
            this.alertCtrl.dismiss()
            
           
          }
        }  
      ]
    });
    await alert.present();
  }

  bloquearFechamento(){
    this.monitorkbService.bloquearFechamentos(this.dataCompetencia, this.dataInicio, this.dataFim).subscribe(
      data => {
        this.carregarFechamentos();
      },
      error => {
        alert("Não foi possível bloquear o fechamento");
      },
      () => {
        console.log(" ")
      }
    )
  }

}
