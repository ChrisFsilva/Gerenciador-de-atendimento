import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  private api = 'https://fila.brentwood.com.br/api';
  // private obterToken(): string {

  //   if (typeof window === 'undefined') {
  //       return '';
  //   }

  //   return localStorage.getItem('token') || '';
  // }

  constructor(
    private http: HttpClient
  ) {}

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

    obterCardsAtendimentos() {
      return this.http.get<any>(
        `${this.api}/dashboard/atendimentos`,
      );
    }
    
    obterGantt() {
      return this.http.get<any>(
          `${this.api}/dashboard/gantt`,
      );

    }

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
