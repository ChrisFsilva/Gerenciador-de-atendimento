import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api';

@Component({
  selector: 'app-lojaCheia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lojaCheia.html',
  styleUrl: './lojaCheia.css',
})

export class LojaCheia {
  // Variavel para armazenar as respostas
  respostas: any = {};

  // Controle de telas
  telaAtual: string = 'jogo';

  // Índice da pergunta atual
  currentIndex: number = 0;
  

  // Estrutura das perguntas
  questions = [
    {
      id: 1,

      category: 'Pendência',

      type: 'input',

      text: 'Qual o nome do cliente?',

      placeholder: 'Digite o nome do cliente',

      value: '',

      points: 0,

      nextId: null
    },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  // Variável para armazenar o valor digitado
  respostaInput: string = '';

  // Responder pergunta de input
  responderInput() {

    // Bloqueia informação vazia
    if (
      !this.respostaInput ||
      this.respostaInput.trim() === ''
    ) {
      return;
    }

    // Salvar valor da resposta
    this.perguntaAtual.value = this.respostaInput;

    // Salva resposta localmente
    this.respostas[this.perguntaAtual.id] = this.respostaInput;

    // Próxima pergunta
    this.irParaPergunta(
      (this.perguntaAtual as any).nextId
    );

    // Limpa campo
    this.respostaInput = '';

  }

  // Pergunta atual
  get perguntaAtual(): any {

    return this.questions[this.currentIndex];

  }

  // Responder pergunta do Select
  responderSelect(opcao: any) {

    // Salvar resposta
    this.respostas[this.perguntaAtual.id] = opcao.label;

    // Próxima pergunta
    this.irParaPergunta(
      opcao.nextId
    );

  }

  // Coleta das perguntas Boolean
  responderBoolean(resposta: 'True' | 'False') {

    this.respostas[this.perguntaAtual.id] = resposta;

    if (resposta === 'True') {

      this.irParaPergunta(
        this.perguntaAtual.sim.nextId
      );

    } else {

      this.irParaPergunta(
        this.perguntaAtual.não.nextId
      );
    }
  }

  salvarLojaCheia (){
    const payload = {
      cliente: this.respostas[1],
      status: "ativo",
    };

    this.apiService.salvarLojaCheia(payload)
      .subscribe({
        next: () => {
          this.router.navigate(['home/fila']);
          },
          error: (erro) => {
            console.error(erro);
          }
    });
  }

  // Navegação entre perguntas
  irParaPergunta(
    nextId: number | null
  ) {

    // Finalizar fluxo
    if (nextId === null) {
        this.salvarLojaCheia();
        return;
    }

    // Localizar próxima pergunta
    const novoIndice = this.questions.findIndex(
      pergunta => pergunta.id === nextId
    );

    // Atualizar pergunta atual
    if (novoIndice !== -1) {

      this.currentIndex = novoIndice;

    }
  }
}