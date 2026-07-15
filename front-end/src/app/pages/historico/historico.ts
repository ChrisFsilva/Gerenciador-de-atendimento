import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistoricoModel } from '../../models/historico.model';
import { FilaService } from '../../services/fila/fila.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [ CommonModule,
              FormsModule],
  templateUrl: './historico.html',
  styleUrl: './historico.css',
})

export class Historico {

  constructor(
    private router: Router,
    public filaService: FilaService,
    private cdr: ChangeDetectorRef,  
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
      }, 600);

    }, 600);
  }

  historicoDia: HistoricoModel[] = [];

  ngOnInit(){
    this.filaService
      .listarHistorico()
      .subscribe({
        next:(res) => {
          console.log(res);
          this.historicoDia = res;
          this.cdr.detectChanges();
        },
        error: (erro) => {
          this.showToast(
            'Erro ao carregar histórico',
            'error'
          );
        },
      });
  }

}