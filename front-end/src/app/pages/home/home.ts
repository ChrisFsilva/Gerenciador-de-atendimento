import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  // ATIVAR ELEMENTOS IMPORTADOS
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
