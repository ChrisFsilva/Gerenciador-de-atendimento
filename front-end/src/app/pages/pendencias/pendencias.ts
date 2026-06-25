import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pendencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pendencias.html',
  styleUrl: './pendencias.css',
})

export class Pendencias { 
  constructor(
    private cdr: ChangeDetectorRef,
    private ApiService: ApiService,
    private router: Router
  ){}

  lista: any[] = [];

  ngOnInit(){
    this.ApiService
      .listarpendencias()
      .subscribe({
        next: (dados) => {
          this.lista = dados;
          console.log('lista de clientes',this.lista);
          this.cdr.detectChanges();
        },
        error: (erro) =>{
          console.error(erro);
        }
      });
  }

  registrarAtendimento(cliente: any){
    console.log('ID:', cliente.id);
    this.ApiService
      .inativarPendencia(cliente.id)
      .subscribe({
        next: () => {
          this.router.navigate(
            ['/home/gamificacao'],
            {
              queryParams: {
                pendenciaId: cliente.id
              }
            }
          );
      },

      error: (erro) => {
        console.error(erro);
      }
    });
  }
}