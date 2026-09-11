import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService) {}

  login() {
    console.log(`Click Email: ${this.email} Senha: ${this.senha}`);

    this.authService.login(
      this.email,
      this.senha
    )

    .subscribe({
      next: (res: any) =>{
        sessionStorage.setItem(
          'token',
          res.access_token
        );

        sessionStorage.setItem(
          'usuario',
          JSON.stringify(res.usuario)
        );
          this.toastService.success('Login realizado com sucesso')
          if (res.usuario.perfil === 'vendedor') {
            this.router.navigate(['/home']);
          } 
          else if (
            res.usuario.perfil === 'gerente' ||
            res.usuario.perfil === 'admin' ||
            res.usuario.perfil === 'diretoria'
          ) {
            this.router.navigate(['/gerencial']);
          }
      },

      error: (erro) => {
        console.error(
          'Erro de login', erro
        );
        this.toastService.error('Login ou senha inválidos');
      }
    });
  }
}