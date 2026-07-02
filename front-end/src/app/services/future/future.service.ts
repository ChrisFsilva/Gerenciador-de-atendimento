import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class FutureService {

    private apiUrl = 'http://127.0.0.1:8000';

    constructor(
        private http: HttpClient
    ) {}

    private obterToken(): string {

        if (typeof window === 'undefined') {
            return '';
        }

        return localStorage.getItem('token') || '';

    }
    carregarOrcamento() {

        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        });

        return this.http.get<any[]>(
            `${this.apiUrl}/carregar-orcamento-futuro`,
            { headers }
        );
    }

    atualizarFuturoLote(
        orcamentosIDs: number[],
        status: string
    ): Observable<any> {

        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        });

        const body = {
            orcamento_ids: orcamentosIDs,
            status: status
        };

        return this.http.put(
            `${this.apiUrl}/orcamento-futuro/atualizar-lote`,
            body,
            { headers }
        );
    }
}