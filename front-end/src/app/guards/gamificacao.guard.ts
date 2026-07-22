import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Gamificacao } from '../pages/gamificacao/gamificacao';

@Injectable({
  providedIn: 'root'
})
export class GamificacaoGuard implements CanDeactivate<Gamificacao> {

  canDeactivate(component: Gamificacao): boolean {

    return !component.emAndamento;

  }

}