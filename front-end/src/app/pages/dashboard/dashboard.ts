  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';

  import { ChartComponent } from 'ng-apexcharts';
  import { DashboardService } from '../../services/dashboard/dashboard.service';
  import { ChangeDetectorRef } from '@angular/core';

  @Component({
    selector: 'app-dashboard',
    standalone: true,

    imports: [
      CommonModule,
      ChartComponent
    ],

    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
  })

  export class Dashboard implements OnInit {

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
      // CRIAÇÃO DO GRAFICO DE LINHA
      //------------------------------------
      this.dashboardService
        .obterVendasMensais()
        .subscribe({
          next: (res) => {
          console.log('INICIANDO CRIAÇÃO DOS DASHBOARDS');
          console.log(res);

          this.cards = res;

          this.chartOptions = {
            series: [
              {
                name: 'Atendimentos',
                data: res.valores
              }
            ],

            chart: {
              type: 'line',
              height: 350,
              toolbar: {
                show: false
              }
            },

            colors: ['#302f29ff'],

            dataLabels: {
              enabled: true
            },

            stroke: {
              curve: 'smooth',
              width: 4
            },

            markers: {
              size: 5
            },

            xaxis: {
              categories: res.meses,
              title: {
                text: 'Meses'
              }
            },

            yaxis: {
              title: {
                text: 'Quantidade'
              }
            }
          };

          this.cdr.detectChanges();
        },
          error: (err) => {
            console.error('ERRO VENDAS MENSAIS', err);
          }
      });
      

      // -----------------------------------
      // OBTER DO BACK A QTD DE FOLLOWS 
      //------------------------------------
      this.dashboardService
        .obterCardsDashboard()
        .subscribe(res => {
          this.cards = res;

          this.cdr.detectChanges();
        });
              
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
      // CRIAÇÃO DE GRÁFICO GANTT
      //------------------------------------
      this.dashboardService
      .obterGantt()
      .subscribe(res => {
        console.log('Gantt');
        console.log(res);

        this.ganttData = res;

        this.cdr.detectChanges();
      });
    }
    
    calcularLarguraFollow(
      followAtual: any,
      proximoFollow: any
    ): number {

      const inicio = new Date(
        followAtual.data_agendamento
      );

      let fim: Date;

      if (proximoFollow) {

        fim = new Date(
          proximoFollow.data_agendamento
        );

      } else {

        fim = new Date(
          followAtual.prazo_final
        );
      }

      const dias =
        (fim.getTime() - inicio.getTime())
        / (1000 * 60 * 60 * 24);

      return Math.max(dias * 30, 40);
    }

    obterCor(estagio: string): string {
      switch (estagio) {
        case 'Ajuste de proposta':
          return '#facc15';
        case 'Negociação final':
          return '#eb6e6eff';
        case 'Fechamento':
          return '#ef4444';
        case 'Em negociação':
          return '#22c594ff';
        case 'Aguardando decisão':
          return '#229fc5ff';
        case 'Contornando objeções':
          return '#cbd358ff';
        case 'Sem necessidade de ajuste':
          return '#8c9ec0ff';
        case 'Momento de entender a preferencia':
          return '#bec0c4ff';
        default:
          return '#81c256ff';
      }
    }
      
    obterIcone(estagio: string): string {
      switch (estagio) {
        case 'Ajuste de proposta':
          return '🔥';
        case 'Negociação final':
          return '🔥';
        case 'Fechamento':
          return '🔥';
        case 'Em negociação':
          return '🧊';
        case 'Aguardando decisão':
          return '🧊';
        case 'Sem necessidade de ajuste':
          return '🍃';
        case 'Momento de entender a preferencia':
          return '🍃';
        case 'Contornando objeções':
          return '🧊';
        default:
          return '🍃';
      }
    }
    
    obterDeslocamento(indice: number): number {
      return indice * 40;
    }
  }