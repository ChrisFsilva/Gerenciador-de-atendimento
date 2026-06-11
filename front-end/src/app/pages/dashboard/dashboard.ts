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

  cardsAtendimento = {
    atendimentos: 0,
    orcamentos: 0,
    percentual: 0,
    atendimentos_hoje: 0,
    atendimentos_mes: 0

  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Dashboard mensal
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
    },
        error: (err) => {
          console.error('ERRO VENDAS MENSAIS', err);
        }
    });
    this.cdr.detectChanges();

    // Cards de quantidade de follows
    this.dashboardService
      .obterCardsDashboard()
      .subscribe(res => {

        this.cards = res;

      });
    
    // Cards de quantidade de atendimento
    this.dashboardService
      .obterCardsAtendimentos()
      .subscribe(res => {
        this.cardsAtendimento = res;
    });

    // Criação do grafico estilo Gantt
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

  obterCor(status: string): string {
      switch (status) {
        case 'Encerrado Brentwood':
          return '#22c55e';
        case 'Encerrado concorrência':
          return '#ef4444';
        case 'Reagendado':
          return '#3b82f6';
        case 'Não realizou o follow':
          return '#991b1b';
        default:
          return '#facc15';
      }
  }
  
  obterDeslocamento(indice: number): number {
    return indice * 40;
  }
}