import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilaService } from '../../../services/fila/fila.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-fila',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './fila.html',
  styleUrl: './fila.css',
})

export class FilaGerencial implements OnInit {
  usuariosFila: any[] = [];

  constructor(
    private filaService: FilaService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.carregarFila();
  }

  carregarFila(): void {
    this.filaService.listarFila().subscribe({
      next:(res) => {
        this.usuariosFila = res.sort((a, b) => {
            return new Date(a.entrada).getTime() - new Date(b.entrada).getTime();
        });

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao carregar a fila: ', erro)
      }
    });
  }
}
