import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  // VARIAVEIS DE ENTRADA
  email: string ='';
  senha: string ='';

  // injetar rotas
  constructor(private router: Router) {}

  // Função de login
  login(){
    // Validação
    if(this.email && this.senha){
      // redirecionar para fila 
      this.router.navigate(['/app'])
    }
  }
}

