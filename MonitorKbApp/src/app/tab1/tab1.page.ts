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

  constructor( public router: Router, public monitorkbService: MonitorkbService) {}

  ngOnInit() {    
    this.carregarDadosDia();    
  }

  carregarDadosDia() {
    this.monitorkbService.obterDadosDoDia().subscribe(value => {
      this.dadosDoDia = value.DadosDoDia || [];      
    });        
  }

  Cobranca() {   
    this.router.navigate(['tabs', 'tab2', {      
    }]);       
}
}