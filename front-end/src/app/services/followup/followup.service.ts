import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { FollowsModel } from "../../models/follow.model";
import { AtualizacaoLoteResponse } from "../../models/follow.model";


@Injectable ({
    providedIn: 'root'
})

export class FollowupServices {
    private apiUrl = 'http://127.0.0.1:8000';
    
    constructor(
        private http: HttpClient
    ){}

    private obterToken(): string {

        if (typeof window === 'undefined') {
            return '';
        }

        return localStorage.getItem('token') || '';
    }

    // Coletar informações do Banco de dados 
    obterDados(){

        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        }); 

        return this.http.get<FollowsModel[]>(
            `${this.apiUrl}/follows`,
            { headers }

        );
    }

    obterAtendimento(
        atendimentoId: number
        ){
        return this.http.get<any>(
            `${this.apiUrl}/atendimento/${atendimentoId}`
        );
    }

    criarFollow(follow: any) {
        return this.http.post(
            `${this.apiUrl}/follows`,
            follow
        );
    }

    atualizarFollow(id: number, dados: any) {

        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        }); 

        return this.http.put(
            `${this.apiUrl}/follows/${id}`,
            dados,
            { headers }
        );
    }
    
    atualizarFollowsLote(followsIDs: number[], status: string): Observable<AtualizacaoLoteResponse>{
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        });

        const body = {
        follow_ids: followsIDs,
        status: status
        };

        return this.http.put<AtualizacaoLoteResponse>(
            `${this.apiUrl}/follows/atualizar-lote`,
            body,
            { headers }
        )  
    }
}