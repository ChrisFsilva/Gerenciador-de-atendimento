import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = '/api';

  constructor(
    private http: HttpClient
  ) {}

  criarAtendimento(
    dados: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/atendimentos`,
      dados
    );

  }

  salvarLojaCheia(payload: any) {
    return this.http.post(
      `${this.apiUrl}/loja-cheia`,
      payload
    );
  }

  listarpendencias(){
    return this.http.get<[]>(
      `${this.apiUrl}/pendencias`
    );
  }

  inativarPendencia(id: number){
    return this.http.put(
      `${this.apiUrl}/pendencias/${id}/inativar`,
      {}
    );
  }

  criarOrcamentoFuturo(payload: any){
    return this.http.post(
      `${this.apiUrl}/orcamento-futuro`,
      payload
    );
  }

  carregarOrcamentoFuturo(){
    return this.http.get<any[]>(
      `${this.apiUrl}/carregar-orcamento-futuro`,
    );
  }
}