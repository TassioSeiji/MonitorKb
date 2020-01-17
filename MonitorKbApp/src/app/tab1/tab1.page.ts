import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MonitorkbService } from 'src/app/services/monitorkb-service/monitorkb.service';
import { NavParams } from '@ionic/angular';
import { ModalService } from '../services/modal-service/modal.service';


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
  armazenarCalculoTotalCriticidade = 0;
  


  constructor(public router: Router, public monitorkbService: MonitorkbService, public modalKbService: ModalService) { }

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
    this.dadosFiltrados = this.dadosDoDia.filter((obj) => obj.sTipoControle === tipoControle)
    document.getElementById("lblTotalCriticidadeAlta").innerHTML = this.calcularTotalPorCriticidade(this.idCriticidadeAlta).toString();
    document.getElementById("lblTotalCriticidadeMedia").innerHTML = this.calcularTotalPorCriticidade(this.idCriticidadeMedia).toString();
    document.getElementById("lblTotalCriticidadeBaixa").innerHTML = this.calcularTotalPorCriticidade(this.idCriticidadeBaixa).toString();
    this.armazenarCalculoTotalCriticidade = (this.calcularTotalPorCriticidade(this.idCriticidadeAlta) + this.calcularTotalPorCriticidade(this.idCriticidadeMedia) + this.calcularTotalPorCriticidade(this.idCriticidadeBaixa));
    document.getElementById("lblTotalCriticidadeTotal").innerHTML = this.armazenarCalculoTotalCriticidade.toString();
  }

  cobranca() {
    this.router.navigate(['tabs', 'tab2', {
    }]);
    
  }
  
}
