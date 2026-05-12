import { Component } from '@angular/core';

@Component({
  selector: 'app-fila',
  imports: [],
  templateUrl: './fila.html',
  styleUrl: './fila.css',
})
export class Fila {

  // Função para funcionamento dos botões no menu horizontal superior
  switchTab(tabName: string) {
    // Lista de telas que podem ser aplicadas no parametro
    const tabs = ['fila', 'orcamento', 'desempenho'];
      
    // Adicionar o parametro em uma varivel
    tabs.forEach(select_page => {

      // Loop para chegar todos parametros
      const btn = document.getElementById(`tab-${select_page}`);
      const content = document.getElementById(`content-${select_page}`);

      // Loop para verificar qual conteudo esta no parametro
      // Verificar se os elementos existem
      if (btn && content)
        // for igual a variavel 
        if (select_page === tabName){
            // Trocar a classe para botão ativado
            btn.className = 
              "tab-active flex-1 bg-slate-50 text-slate-800 font-semibold py-4 px-2 sm:px-4 rounded-t-xl transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap";
            
            content.classList.remove('hidden');
            
            // Faz o conteudo aparecer
            content.classList.add('flex');
            
            // ajustar display para o modo limpo
            if(select_page !== 'fila') {
              content.classList.replace('flex', 'block');
            } 
        }

        // Se o parametro não foi igual o da variavel
        else {
            // Trocar a classe para botão desativado
            btn.className = "flex-1 bg-gray-400 text-gray-700 hover:bg-gray-300 hover:text-slate-800 font-medium py-3 px-2 sm:px-4 mt-1 rounded-t-xl transition-all flex items-center justify-center gap-2 shadow-inner whitespace-nowrap";
            
            content.classList.add('hidden');
            // Oculta o conteudo
            content.classList.remove('flex', 'block');
          }
      }
    });
  }

  // Notificação de regitro
      // Mensagem de sucesso
  showToast(message:string, type:string = 'success') {
      const container = document.getElementById('toast-container');
      
      const toast = document.createElement('div');
      
      // Estilo base das notificações
      let notificationbaseStyles = "flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 translate-x-full opacity-0 max-w-sm";
      
      // Icone e cores dos estilos
      let icon = '';
      // Em caso de sucesso
      if (type === 'success') {
          toast.className = `${notificationbaseStyles} bg-white border-l-4 border-green-500 text-slate-800`;
          icon = '<i class="fa-solid fa-circle-check text-green-500 text-xl"></i>';
      }
      // Em caso de erro 
      else if (type === 'error') {
          toast.className = `${notificationbaseStyles} bg-white border-l-4 border-red-500 text-slate-800`;
          icon = '<i class="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>';
      }

      // Mensagem apresentada
      toast.innerHTML = `
          ${icon}
          <span class="font-medium">${message}</span>
      `;

      container.appendChild(toast);

      // Animação de entrada
      setTimeout(() => {
          toast.classList.remove('translate-x-full', 'opacity-0');
          toast.classList.add('translate-x-0', 'opacity-100');
      }, 10);

      // Animação de saída
      setTimeout(() => {
          toast.classList.remove('translate-x-0', 'opacity-100');
          toast.classList.add('translate-x-full', 'opacity-0');
          
          // Remove elemento DOM 3 segundos após o termino da animação
          setTimeout(() => {
              toast.remove();
          }, 300);
      }, 3000);
  }