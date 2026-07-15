import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FilaModel } from '../../models/fila.model';
import { FilaService } from '../../services/fila/fila.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';



@Component({
  selector: 'app-fila',
  standalone: true,
  templateUrl: './fila.html',
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrl: './fila.css',
})


export class Fila implements OnInit, OnDestroy  {
  
  private heartbeatSubscription?: Subscription

  constructor(
    private router: Router,
    public filaService: FilaService,
    private cdr: ChangeDetectorRef,  
  ){}
  
  lojaCheia: boolean = false;
  posicaoFila: number = 0;
  fila: FilaModel[]=[];

  private filaSubscription!: Subscription;

  ngOnInit(): void {

    this.atualizarPosicao();
    this.carregarFila();
    this.heartbeatSubscription = interval(30000).subscribe(() => {

      this.atualizarPosicao();

      this.filaService
        .heartbeatFila()
        .subscribe({
          next: (res) => {
            console.log("Heartbeat acionado", res)
          },
          error: (erro) => {
            console.error("Heartbeat falhou", erro);
          }
        });

      this.cdr.detectChanges();

    });
  }

  ngOnDestroy(): void {
    this.heartbeatSubscription?.unsubscribe();
  }

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
      }, 3000);

    }, 3000);
  }
  entrarFila(){
    this.filaService
      .entrarFila()
      .subscribe({
        next: () => {
          this.filaService.estaNaFila = true;
          console.log(this.filaService.estaNaFila);
          this.atualizarPosicao();
          this.cdr.detectChanges();
          this.showToast(
            'Você entrou na fila',
            'success'
          );
        },
      error: (erro) => {
        console.error(erro);
        this.showToast(
          'Erro ao entrar na fila',
          'error'
        );
      }
    })
  }
  atualizarPosicao(){
    this.filaService
      .obterPosicao()
      .subscribe({
        next: (res) => {
          this.posicaoFila = res.posicao;
          this.filaService.estaNaFila = true;
          this.cdr.detectChanges();
          this.carregarFila();
        },
        error: () => {
          this.posicaoFila = 0;
          this.filaService.estaNaFila = false;
        }
      });
  }

  sairFila() {

    this.filaService
    .sairFila()
    .subscribe({
      next:() =>{
        this.filaService.estaNaFila = false;
        this.posicaoFila = 0;
        this.cdr.detectChanges();
        this.carregarFila();
        this.showToast(
          'Você saiu da fila',
          'error'
        );
      },
      error: (erro) => {
        console.error(erro);

        this.showToast(
          'Erro ao sair da fila',
          'error'
        );
      }
    });
  }

  registrarAtendimento(){
    if (this.lojaCheia){
      this.router.navigate(['/home/lojaCheia']);
      console.log("Botão ativo")
    } else{
      this.router.navigate(['/home/gamificacao']);
      console.log("Botão desativado")
    }
    this.sairFila();
  }

  usuariosFila: any[] = [];

  carregarFila() {
    this.filaService
      .listarFila()
      .subscribe({
      next: res => {
        this.usuariosFila = res;
        this.cdr.detectChanges();
      }
    });
  }

  StatusAtividade(ultimaAtividade: Date | string): string {
    const ultima = new Date(ultimaAtividade);
    const agora = new Date();

    const minutos = (agora.getTime() - ultima.getTime()) / 1000 / 60;

    if (minutos < 3) {
      return 'status-verde';
    }

    if (minutos < 10) {
      return 'status-amarelo';
    }

    return 'status-vermelho';
  }
  
}