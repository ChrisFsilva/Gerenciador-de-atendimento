import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FilaModel } from '../../models/fila.model';
import { FilaService } from '../../services/fila/fila.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ToastService } from '../../services/toast/toast.service';


@Component({
  selector: 'app-fila',
  standalone: true,
  templateUrl: './fila.html',
  imports: [
    CommonModule,
    FormsModule,
  ],
  styleUrl: './fila.css',
})


export class Fila implements OnInit, OnDestroy  {
  
  private heartbeatSubscription?: Subscription

  constructor(
    private router: Router,
    public filaService: FilaService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ){}
  
  lojaCheia: boolean = false;
  posicaoFila: number = 0;
  fila: FilaModel[]=[];

  private filaSubscription!: Subscription;

  ngOnInit(): void {

    this.atualizarPosicao();
    this.carregarFila();
    this.heartbeatSubscription = interval(60000).subscribe(() => {

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

  entrarFila(){
    this.filaService
      .entrarFila()
      .subscribe({
        next: () => {
          this.filaService.estaNaFila = true;
          console.log(this.filaService.estaNaFila);
          this.toastService.success(
            'Você entrou na fila',
          );
          this.atualizarPosicao();
          this.cdr.detectChanges();
        },
      error: (erro) => {
        console.error(erro);
        this.toastService.error(
          'Erro ao entrar na fila, contate o TI',
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
        error: (erro) => {
          // Usuário realmente não está na fila
          if (erro.status === 404) {
            
            this.posicaoFila = 0;
            this.filaService.estaNaFila = false;

          }
          // Sessão expirou
          else if (erro.status === 401) {
            this.router.navigate(['/login']);
          }

          else {
            this.toastService.error(
              'Erro ao consultar a fila, atualize sua página'
            );

          }

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
        this.toastService.success('Você saiu da fila');
      },
      error: (erro) => {
        console.error(erro);

        this.toastService.error(
          'Erro ao sair da fila',
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

    if (minutos < 10) {
      return 'status-verde';
    }

    if (minutos < 17) {
      return 'status-amarelo';
    }

    return 'status-vermelho';
  }
  
}