import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// IMPORTAR PÁGINAS
import {Fila} from './pages/fila/fila';
import { Dashboard } from './pages/dashboard/dashboard';
import { Followup } from './pages/followup/followup';

@Component({
  // TAG RAIZ
  selector: 'app-root',
  // ATIVAR ELEMENTOS IMPORTADOS
  imports: [
    CommonModule,
    Fila,
    Dashboard,
    Followup],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // DEFINIR PÁGINA INICIAL 
  activeTab: string = 'fila';

  // ALTERAR A PAGINA CONFORME BOTÃO SELECIONADO
  switchTab(tabName: string){
    this.activeTab = tabName;
  }
}
