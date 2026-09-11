import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio-gerencial',
  standalone: true,
  template: `
    <section class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800">Início gerencial</h2>
      <p class="mt-2 text-sm text-gray-600">
        Área reservada para usuários com perfil gerencial ou administrativo.
      </p>
    </section>
  `
})
export class InicioGerencial {}
