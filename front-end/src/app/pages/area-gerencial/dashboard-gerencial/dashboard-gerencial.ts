import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard-gerencial',
  imports: [CommonModule],
  templateUrl: './dashboard-gerencial.html',
  styleUrl: './dashboard-gerencial.css',
})

export class DashboardGerencial implements OnInit {

    ganttData: any[] = [];

    public chartOptions: any = {};

    cards = {
      hoje: 0,
      ultimos15dias: 0,
      mes: 0
    };
    

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

    // -----------------------------------------------
    // LISTA DE VÁRIAVEIS COM CALCULO DOS VALORES ORÇADOS
    // -----------------------------------------------
    valoresOrcamentos = {
      hoje: 0,
      mes: 0,
      total: 0
    };

    vendedoresOrcamentos: any[] = [];

    // -----------------------------------------------
    // LISTA DE VÁRIAVEIS COM FOLLOWS CONTABILIZADOS POR STATUS
    // -----------------------------------------------

    follow = {
        hoje: 0,
        mes: 0,
        naoRealizado: 0,
        desistencia: 0,
        vendido: 0,
        concorrente: 0,
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

    constructor(
      private dashboardService: DashboardService,
      private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
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

          this.vendedoresOrcamentos = res.metricaOrcamentos;
          this.cdr.detectChanges();
        });

      // -----------------------------------
      // OBTER QUANTIDADE DE FOLLOWS 
      //------------------------------------
      this.dashboardService
        .obterCardsAtendimentos()
        .subscribe(res => {

          this.cardsAtendimento = {

            atendimentos: Number(res.atendimentos),
            atendimentos_hoje: Number(res.atendimentos_hoje),
            atendimentos_mes: Number(res.atendimentos_mes),

            orcamentos: Number(res.orcamentos),
            orcamentos_hoje: Number(res.orcamentos_hoje),
            orcamentos_mes: Number(res.orcamentos_mes),

            percentual: Number(res.percentual),
            venda_ato: Number(res.venda_ato)
          };

          this.vendedores = res.vendedores;

          console.log('FOLLOWS:', res);

          this.cdr.detectChanges();
        });

    }
    
  }
