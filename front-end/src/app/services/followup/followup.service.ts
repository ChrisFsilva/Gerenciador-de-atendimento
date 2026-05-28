import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FollowsModel } from "../../models/follow.model";

@Injectable ({
    providedIn: 'root'
})

export class FollowupServices {
    private apiUrl = 'http://127.0.0.1:8000';
    
    constructor(
        private http: HttpClient
    ){}

    // Coletar informações do Banco de dados -- MOCADO --
    obterFollowup(){

        return this.http.get<FollowsModel[]>(
            'http://127.0.0.1:8000/follows'
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

    return this.http.put(
        `${this.apiUrl}/follows/${id}`,
        dados
    );
    }
}