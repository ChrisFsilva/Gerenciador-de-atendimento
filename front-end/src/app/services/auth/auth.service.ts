import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'   
})

export class AuthService {
    private api = 'http://127.0.0.1:8000';

    constructor(
        private http: HttpClient
    ) {}

    login(
        email: string,
        senha: string
    ){
        console.log('Entrou no service');
        
        return this.http.post(
            `${this.api}/login`,
            {
                email,
                senha
            }
        );
    }
}