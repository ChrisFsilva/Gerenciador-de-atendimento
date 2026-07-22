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
    console.log(`Click Login: ${this.email} E-mail ${this.senha}`);

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


          console.log('INICIANDO TRANSFERENCIA PARA HOME');
          this.toastService.success('Login realizado com sucesso')
          this.router.navigate(['/home'])
            .then(resultado => {
              console.log('NAVEGOU?', resultado);
            })
            .catch(erro => {
              console.error('ERRO NAVEGAÇÃO', erro);
            });

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