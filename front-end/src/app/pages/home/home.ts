import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FilaService } from '../../services/fila/fila.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(
    private filaService: FilaService,
    private router: Router,
  ){}

  logout(){
    if (this.filaService.estaNaFila){
      this.filaService.sairFila()
        .subscribe({
          next: () => {
            console.log('Saiu da fila')
            this.finalizarLogout();
            console.log('Deslogou')
          },
          error: () => {
            this.finalizarLogout();
          }
        });
    }
    else{
      this.finalizarLogout();
      console.log('Deslogou')
    }
  }
  
  finalizarLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login'])
  }
}
