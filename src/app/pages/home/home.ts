import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// IMPORTAR PÁGINAS
import { Fila } from '../fila/fila';
import { Dashboard } from '../dashboard/dashboard';
import { Followup } from '../followup/followup';

@Component({
  // ATIVAR ELEMENTOS IMPORTADOS
  imports: [
    CommonModule,
    Fila,
    Dashboard,
    Followup],

  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // DEFINIR PÁGINA INICIAL 
  activeTab: string = 'fila';

  // ALTERAR A PAGINA CONFORME BOTÃO SELECIONADO
  switchTab(tabName: string){
    this.activeTab = tabName;
  }
}
