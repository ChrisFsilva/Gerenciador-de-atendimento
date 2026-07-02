import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { FutureService } from '../../services/future/future.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-futuro',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './futuro.html',
  styleUrl: './futuro.css',
})
export class Futuro {

  constructor (
    private router: Router,
    public futureService: FutureService,
    private cdr: ChangeDetectorRef,

  ){}

  listaFuturo: any[] = [];
  
  ngOnInit(){
    this.futureService
      .carregarOrcamento()
      .subscribe({
        next:(listaOrcamentos) => {
          this.listaFuturo = listaOrcamentos;
          this.cdr.detectChanges()
        },
      error: (erro) => {
        console.error(erro);
      }
    });
  }
}
