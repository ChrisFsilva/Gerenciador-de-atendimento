import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VendedorFollow {
  nome: string;
  atrasados: number;
  hoje: number;
  mes: number;
}

@Component({
  selector: 'app-follows-gerencial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './follows-gerencial.html',
  styleUrl: './follows-gerencial.css',
})
export class FollowsGerencial {

  followsAtrasados = 12;
  followsHoje = 8;
  followsMes = 47;

  vendedores: VendedorFollow[] = [
    {
      nome: 'João',
      atrasados: 3,
      hoje: 2,
      mes: 12
    },
    {
      nome: 'Maria',
      atrasados: 1,
      hoje: 4,
      mes: 15
    },
    {
      nome: 'Carlos',
      atrasados: 5,
      hoje: 1,
      mes: 10
    },
    {
      nome: 'Ana',
      atrasados: 2,
      hoje: 3,
      mes: 8
    }
  ];

}