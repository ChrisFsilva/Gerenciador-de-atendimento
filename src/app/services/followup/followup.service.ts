import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FollowsModel } from "../../models/follow.model";

@Injectable ({
    providedIn: 'root'
})

export class FollowupServices {
    constructor(
        private http: HttpClient
    ){}

    // Coletar informações do Banco de dados -- MOCADO --
    obterFollowup(): Observable<FollowsModel[]>{
        return this.http.get<FollowsModel[]>
        ('assets/mock/follows.json');
    }
}