import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class FilaService{
    
    estaNaFila: boolean = false;

    private api = 'http://127.0.0.1:8000';
    constructor(
        private http: HttpClient
    ){}

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
            {}
        );
    }
}