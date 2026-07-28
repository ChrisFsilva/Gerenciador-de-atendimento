import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';

@Injectable({
    providedIn: 'root'   
})

export class AuthService {
    private api = environment.apiUrl;

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