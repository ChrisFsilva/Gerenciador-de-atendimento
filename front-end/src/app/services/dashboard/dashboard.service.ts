import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  private api = 'http://developer.fila.brentwood.com.br/api';
  // private obterToken(): string {

  //   if (typeof window === 'undefined') {
  //       return '';
  //   }

  //   return localStorage.getItem('token') || '';
  // }

  constructor(
    private http: HttpClient
  ) {}

    // -----------------------------------------------
    // RETORNO DOS DADOS DE FOLLOW
    // -----------------------------------------------
    obterVendasMensais() {
      return this.http.get<any>(
          `${this.api}/dashboard/follows-mensais`,
      );
    }

    obterCardsDashboard() {
      return this.http.get<any>(
          `${this.api}/dashboard/cards`,
      );
    }

    // -----------------------------------------------
    // RETORNO DOS DADOS DE ATENDIMENTO
    // -----------------------------------------------
    obterCardsAtendimentos() {
      return this.http.get<any>(
        `${this.api}/dashboard/atendimentos`,
      );
    }
    // -----------------------------------------------
    // RETORNO DAS INFORMAÇÕES QUE ALIMENTARAM O GRAFICO GANTT
    // -----------------------------------------------
    
    obterGantt() {
      return this.http.get<any>(
          `${this.api}/dashboard/gantt`,
      );

    }

    // -----------------------------------------------
    // RETORNO DO CALCULO DOS VALORES DE ORÇAMENTO
    // -----------------------------------------------
    obterValoresOrcamentos() {
      return this.http.get<any>(
        `${this.api}/dashboard/valores-orcamentos`
      );
    }
    // -----------------------------------------------
    // CRIAÇÃO DO GRAFICO GANTT
    // -----------------------------------------------
    montarEstruturaGantt(dados: any[]) {
    const mapa = new Map();

    dados.forEach(({ vendedor, cliente, follow }) => {
      if (!mapa.has(vendedor)) {
        mapa.set(vendedor, {
          id: vendedor,
          name: vendedor,
          children: new Map()
        });
      }

      const vendedorNode = mapa.get(vendedor);

      if (!vendedorNode.children.has(cliente)) {
        vendedorNode.children.set(cliente, {
          id: `${vendedor}-${cliente}`,
          name: cliente,
          children: []
        });
      }

      const clienteNode = vendedorNode.children.get(cliente);

      clienteNode.children.push({
        id: `${cliente}-follow-${follow}`,
        name: `Follow ${follow}`
      });
    });

    return Array.from(mapa.values()).map(v => 
        ({...v,children: Array.from(v.children.values())
        }));
    }
}
