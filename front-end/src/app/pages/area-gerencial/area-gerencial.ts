import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-area-gerencial',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <h1 class="text-xl font-semibold text-gray-800">Área Gerencial</h1>
      </header>

      <main class="p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AreaGerencial {}
