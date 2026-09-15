import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { ChangeDetectorRef } from '@angular/core';

interface VendedorFollow {
  nome: string;
  atrasados: number;
  hoje: number;
  mes: number;
}

@Component({
  selector: 'app-follows-gerencial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './follows-gerencial.html',
  styleUrl: './follows-gerencial.css',
})
export class FollowsGerencial {

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  // -----------------------------------------------
  // LISTA DE VÁRIAVEIS PARA O GRAFICO DE RENDIMENTO
  // -----------------------------------------------
  cardsAtendimento = {
    atendimentos: 0,
    atendimentos_hoje: 0,
    atendimentos_mes: 0,
    orcamentos: 0,
    orcamentos_hoje: 0,
    orcamentos_mes: 0,
    percentual: 0,
    venda_ato: 0,
  };

  valoresOrcamentos = {
    hoje: 0,
    mes: 0,
    total: 0
  };

  follow = {
      hoje: 0,
      mes: 0,
      naoRealizado: 0,
      desistencia: 0,
      vendido: 0,
      concorrente: 0,
      atrasado: 0
    };

  vendedores: any[] = [];

  formatarValor(valor: number | string): string {
    const numero = Number(valor);

    if (isNaN(numero)) {
      return 'R$ 0,00';
    }

    return 'R$ ' + numero
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  ngOnInit(): void {
    // -----------------------------------
    // OBTER DO BACK A QTD DE ORÇAMENTOS 
    //------------------------------------
    this.dashboardService
      .obterCardsAtendimentos()
      .subscribe(res => {
        this.cardsAtendimento = res;
    });

    // -----------------------------------
    // OBTER DO BACK O VALOR DE ORÇAMENTOS 
    //------------------------------------
    this.dashboardService
      .obterValoresOrcamentos()
      .subscribe(res => {
        this.valoresOrcamentos = {
          hoje: Number(res.hoje),
          mes: Number(res.mes),
          total: Number(res.total),
        };

        this.cdr.detectChanges();
      });

    // -----------------------------------
    // OBTER QUANTIDADE DE FOLLOWS 
    //------------------------------------
    this.dashboardService
      .obterFollows()
      .subscribe(res => {

        this.follow = {
          hoje: Number(res.follows_hoje),
          mes: Number(res.follows_mes),
          naoRealizado: Number(res.naoRealizado),
          desistencia: Number(res.desistencia),
          vendido: Number(res.vendido),
          concorrente: Number(res.concorrente),
          atrasado: Number(res.atrasado),
        };

        this.vendedores = res.vendedores;

        console.log('FOLLOWS:', res);

        this.cdr.detectChanges();
      });
  }

}