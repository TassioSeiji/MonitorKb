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
  quantidadeOcorrencias = [];
  totalTodos:any = 0;
  totalGrave = 0;
  totalMedio = 0;
  totalFraco = 0;

  constructor( public router: Router, public monitorkbService: MonitorkbService) {}

  ngOnInit() {    
    this.carregarDadosDia();
    this.totalGrave:any = ;
  }

  carregarDadosDia() {
    this.monitorkbService.obterDadosDoDia().subscribe(value => {
      this.dadosDoDia = value.DadosDoDia || [];      
    });        
  }
  calcularTotalPorCriticidade(idCriticidade) 
  {
    this.totalGrave=idCriticidade
    return  this.dadosDoDia = (a => a.nCodCriticidade = idCriticidade)
  }
  Cobranca() {   
    this.router.navigate(['tabs', 'tab2', {      
    }]);       
}
}