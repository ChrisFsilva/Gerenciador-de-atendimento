import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FilaModel } from '../../models/fila.model';


@Component({
  selector: 'app-fila',
  standalone: true,
  templateUrl: './fila.html',
  imports: [
    CommonModule
  ],
  styleUrl: './fila.css',
})


export class Fila {
  estaNaFila: boolean = false;
  posicaoFila: number = 0;
  fila: FilaModel[]=[];

  constructor(
    private router: Router
  ){}

  showToast(message: string, type: string = 'success') {

    const container = document.getElementById('toast-container');

    if (!container) return;

    const toast = document.createElement('div');

    const baseStyles = `
      flex
      items-center
      gap-3
      px-6
      py-4
      rounded-lg
      shadow-2xl
      transform
      transition-all
      duration-300
      translate-x-full
      opacity-0
      max-w-sm
    `;

    let icon = '';

    if (type === 'success') {

      toast.className = `
        ${baseStyles}
        bg-white
        border-l-4
        border-green-500
        text-slate-800
      `;

      icon = `
        <i class="fa-solid fa-circle-check text-green-500 text-xl"></i>
      `;
    }

    else if (type === 'error') {

      toast.className = `
        ${baseStyles}
        bg-white
        border-l-4
        border-red-500
        text-slate-800
      `;

      icon = `
        <i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>
      `;
    }

    toast.innerHTML = `
      ${icon}
      <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    // Entrada
    setTimeout(() => {

      toast.classList.remove(
        'translate-x-full',
        'opacity-0'
      );

      toast.classList.add(
        'translate-x-0',
        'opacity-100'
      );

    }, 10);

    // Saída
    setTimeout(() => {

      toast.classList.remove(
        'translate-x-0',
        'opacity-100'
      );

      toast.classList.add(
        'translate-x-full',
        'opacity-0'
      );

      setTimeout(() => {
        toast.remove();
      }, 300);

    }, 3000);
  }
  entrarFila() {
    this.estaNaFila = true;
    this.posicaoFila = Math.floor(Math.random() * 10) + 1;;
    this.showToast(
      'Você entrou na fila',
      'success'
    );
  }
  sairFila() {
    this.estaNaFila = false;
    this.posicaoFila = 0;
    this.showToast(
      'Você saiu da fila',
      'error'
    );
  }
  registrarAtendimento(){

    // Navega para a gamificação
    this.router.navigate(['/home/gamificacao'])
      .then(() => {
        console.log('SAIU DA FILA')
        this.sairFila();
      });
  }
}