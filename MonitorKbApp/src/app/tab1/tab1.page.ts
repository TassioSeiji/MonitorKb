import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MonitorkbService } from 'src/app/services/monitorkb-service/monitorkb.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  dadosDoDia = [];
  produtoContabil = [];
  dadosFiltrados = [];
  totalCriticidadeTodas= 0;
  totalCriticidadeAlta = 0;
  totalCriticidadeMedio = 0;
  totalCriticidadeFraco = 0;
  idCriticidadeAlta = 1;
  idCriticidadeMedia = 2;
  idCriticidadeBaixa = 3;
  

  constructor(public router: Router, public monitorkbService: MonitorkbService) { }

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

  produtoContabilComparador(tipoControle){
   this.dadosFiltrados = this.dadosDoDia.filter((obj) => obj.sTipoControle === tipoControle)
   this.totalCriticidadeAlta = this.calcularTotalPorCriticidade(this.idCriticidadeAlta);
   this.totalCriticidadeMedio = this.calcularTotalPorCriticidade(this.idCriticidadeMedia);
   this.totalCriticidadeFraco = this.calcularTotalPorCriticidade(this.idCriticidadeBaixa);
   this.totalCriticidadeTodas = this.totalCriticidadeAlta+this.totalCriticidadeMedio+this.totalCriticidadeFraco;
   
  }

  cobranca() {
    this.router.navigate(['tabs', 'tab2', {
    }]);
  }
}
