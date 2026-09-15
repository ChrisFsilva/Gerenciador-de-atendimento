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

    // -----------------------------------------------
    // RETORNO DOS DADOS DE ATENDIMENTO
    // -----------------------------------------------
    obterCardsAtendimentos() {
      return this.http.get<any>(
        `${this.api}/dashboard/atendimentos`,
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
    // RETORNO DO CALCULO DE QUANTIDADE DOS FOLLOWS
    // -----------------------------------------------
    obterFollows() {
      return this.http.get<any>
        (`${this.api}/dashboard/follows`
          
        );
    }
}
