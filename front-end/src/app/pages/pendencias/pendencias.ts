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
    console.log(this.router);
    this.ApiService
      .listarpendencias()
      .subscribe({
        next: (dados) => {
          this.lista = dados;
          console.log(this.lista)
          this.cdr.detectChanges();
        },
        error: (erro) =>{
          console.error(erro);
        }
      });
  }

  registrarAtendimento(){
    console.log('Click detectado')
    this.router.navigate(['/home/gamificacao']);
  }
}