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
  styleUrl: './login.css'
})

export class Login {

  email: string = '';
  senha: string = '';

  constructor(private router: Router) {}

  login() {

    if (
      this.email === 'treinamento'
      &&
      this.senha === '1234'
    ) {

      this.router.navigate(['/home']);

    } else {

      this.showToast(
        'Login ou senha inválidos',
        'error'
      );

    }
  }

  showToast(
  mensagem: string,
  tipo: 'success' | 'error'
) {

  const toast = document.createElement('div');

  toast.innerText = mensagem;

  toast.style.position = 'fixed';
  toast.style.top = '50%';
  toast.style.left = '50%';
  toast.style.transform = 'translate(-50%, -50%)';

  toast.style.background = 'red';
  toast.style.color = 'white';

  toast.style.padding = '20px';

  toast.style.zIndex = '99999';

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
  
  }
}