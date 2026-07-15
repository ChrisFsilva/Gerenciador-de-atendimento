import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders  } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class FilaService{
    
    estaNaFila: boolean = false;

    private api = 'http://developer.fila.brentwood.com.br/api';
    constructor(
        private http: HttpClient
    ){}

    private obterToken(): string {

        if (typeof window === 'undefined') {
            return '';
        }

        return localStorage.getItem('token') || '';
    }

    entrarFila(){
        return this.http.post<any>(
            `${this.api}/fila/entrar`,
            {}
        );
    }

    obterPosicao(){
        return this.http.get<any>(
            `${this.api}/fila/minha-posicao`,
            {}
        );
    }

    sairFila() {
        return this.http.post(
            `${this.api}/fila/sair`,
            {},
        );
    }

    heartbeatFila() {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        }); 

        return this.http.post(
            `${this.api}/fila/heartbeat`,
            {},
            { headers },
            
        );
    }
    
    listarFila() {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        });

        return this.http.get<any[]>(
            `${this.api}/fila`,
            { headers },
        );
    }
    
    listarHistorico() {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.obterToken()}`
        });

        return this.http.get<any[]>(
            `${this.api}/fila/historico`,
            { headers },
        );
    }   
}