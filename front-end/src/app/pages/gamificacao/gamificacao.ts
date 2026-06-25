import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api';

@Component({
  selector: 'app-gamificacao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './gamificacao.html',
  styleUrl: './gamificacao.css',
})

export class Gamificacao {
  // Variavel para armazenar as respostas
  respostas: any = {};

  // Controle de telas
  telaAtual: string = 'jogo';

  // Pontuação total
  score: number = 0;

  // Índice da pergunta atual
  currentIndex: number = 0;

  tipoFluxo: 'normal' | 'orcamento_futuro' = 'normal';
  

  // Estrutura das perguntas
  questions = [
    {
      id: 1,

      category: 'Definição',

      type: 'select',

      text: 'Esse atendimento foi sobre?',

      options: [

        {
          label: 'Um retorno',
          points: 100,
          nextId: 2
        },

        {
          label: 'Cliente novo',
          points: 100,
          nextId: 2
        },
      ]
    },

    {
      id: 2,

      category: 'Follow-up',

      type: 'select',

      text: 'Foi gerado orçamento no ato?',

      options: [

        {
          label: 'Não',
          points: 100,
          nextId: 3
        },

        {
          label: 'Orçamento futuro',
          points: 50,
          nextId: 4
        },

        {
          label: 'Sim',
          points: 100,
          nextId: 3
        },
      ]
    },

    {
      id: 3,

      category: 'Follow-up',

      type: 'input',

      text: 'Qual o número do orçamento?',

      placeholder: 'Digite o número do orçamento',

      value: '',

      points: 100,

      nextId: 4
    },

    {
      id: 4,

      category: 'Follow-up',

      type: 'datetime-local',

      text: 'Qual a data do próximo contato?',

      value: '',

      points: 100,

      nextId: 5
    },
    {
      id: 5,

      category: 'Follow-up',

      type: 'select',

      text: 'Como ficou o alinhado o contato com o cliente?',

      options: [

        {
          label: 'Whatsapp',
          points: 100,
          nextId: 6
        },

        {
          label: 'E-mail',
          points: 100,
          nextId: 7
        },

        {
          label: 'Visita na loja',
          points: 100,
          nextId: 6
        },
      ]
    },

    {
      id: 6,

      category: 'Orçamento',

      type: 'input',

      text: 'Digite o nome dos concorrentes?',

      placeholder: 'Digite o nome dos concorrentes',

      value: '',

      points: 100,

      nextId: 7
    },

    {
      id: 7,

      category: 'Arena competitiva',

      type: 'boolean',

      text: 'Você conseguiu o prazo de conclusão do cliente?',

      sim: {
        points: 300,
        nextQuestion: 'Qual a data limite do cliente?',
        nextId: 8
      },
      não: {
        points: 100,
        nextQuestion: 'Neste projeto, há profissional envolvido?',
        nextId: 9
      },
    },
    {
      id: 8,

      category: 'Follow-up',

      type: 'datetime-local',

      text: 'Qual a data limite do cliente?',

      value: '',

      points: 100,

      nextId: 9
    },
    {
      id: 9,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Utilizei a abordagem Brentwood?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri a jornada do cliente?',
        nextId: 10
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri a jornada do cliente?',
        nextId: 10
      },
    },
    {
      id: 10,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri a jornada do cliente?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri o motivo da compra?',
        nextId: 11
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri o motivo da compra?',
        nextId: 11
      },
    },
    {
      id: 11,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri o motivo da compra?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri as pessoas que farão parte do processo de decisão?',
        nextId: 12
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri as pessoas que farão parte do processo de decisão?',
        nextId: 12
      },
    },
    {
      id: 12,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri as pessoas que farão parte do processo de decisão?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri se há profissional auxiliando no processo de decisão?',
        nextId: 13
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri se há profissional auxiliando no processo de decisão?',
        nextId: 13
      },
    },
    {
      id: 13,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri se há profissional auxiliando no processo de decisão?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri o produto inicial?',
        nextId: 14
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri o produto inicial?',
        nextId: 14
      },
    },
    {
      id: 14,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri o produto inicial?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri a possibilidade de produtos adicionais para o ambiente inicial?',
        nextId: 15
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri a possibilidade de produtos adicionais para o ambiente inicial?',
        nextId: 15
      },
    },
    {
      id: 15,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri a possibilidade de produtos adicionais para o ambiente inicial?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri demais ambientes e todas as possibilidades de produtos adicionais?',
        nextId: 16
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri demais ambientes e todas as possibilidades de produtos adicionais?',
        nextId: 16
      },
    },
        {
      id: 16,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri demais ambientes e todas as possibilidades de produtos adicionais?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri estilo, gosto e prefêrencia do cliente?',
        nextId: 17
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri estilo, gosto e prefêrencia do cliente?',
        nextId: 17
      },
    },
    {
      id: 17,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri estilo, gosto e prefêrencia do cliente?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri como será utilizado os produtos iniciais?',
        nextId: 18
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri como será utilizado os produtos iniciais?',
        nextId: 18
      },
    },
    {
      id: 19,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri como será utilizado os produtos iniciais?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri experiências que possam ter gerado gerado insatisfações?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri experiências que possam ter gerado gerado insatisfações?',
        nextId: null
      },
    },
    {
      id: 20,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri experiências que possam ter gerado gerado insatisfações?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri o valor real para o cliente?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri o valor real para o cliente?o',
        nextId: null
      },
    },
    {
      id: 21,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri o valor real para o cliente?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri a arena competitiva?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri a arena competitiva',
        nextId: null
      },
    },
    {
      id: 22,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri a arena competitiva?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri o valor que o cliente pretente investir?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri o valor que o cliente pretente investir',
        nextId: null
      },
    },
    {
      id: 23,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri o valor que o cliente pretente investir?',

      sim: {
        points: 100,
        nextQuestion: 'Utilizei a forma de demonstração Brentwood?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Utilizei a forma de demonstração Brentwood',
        nextId: null
      },
    },
    {
      id: 24,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Utilizei a forma de demonstração Brentwood?',

      sim: {
        points: 100,
        nextQuestion: 'Estabeleci o que é "valor" para o cliente?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Estabeleci o que é "valor" para o cliente?',
        nextId: null
      },
    },
    {
      id: 25,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Estabeleci o que é "valor" para o cliente?',

      sim: {
        points: 100,
        nextQuestion: 'Utilizei a forma de contorno de objeções Brentwood?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Utilizei a forma de contorno de objeções Brentwood',
        nextId: null
      },
    },
        {
      id: 26,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Utilizei a forma de contorno de objeções Brentwood?',

      sim: {
        points: 100,
        nextQuestion: 'Descobri a verdadeira objeção?',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'Descobri a verdadeira objeção?',
        nextId: null
      },
    },
        {
      id: 27,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri a verdadeira objeção?',

      sim: {
        points: 100,
        nextQuestion: 'finalizar atendimento',
        nextId: null
      },
      não: {
        points: -100,
        nextQuestion: 'finalizar atendimento',
        nextId: null
      },
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

    // Soma pontos
    this.score += (this.perguntaAtual as any).points || 0;

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

    this.respostas[this.perguntaAtual.id] = opcao.label;

    this.score += opcao.points;

    if (opcao.label === 'Orçamento futuro') {
      this.tipoFluxo = 'orcamento_futuro';
    }

    this.irParaPergunta(opcao.nextId);
  }

  // Ranking baseado na pontuação
  get ranking(): string {

    if (this.score >= 1500) {
      return 'Diamante';
    }

    if (this.score >= 1000) {
      return 'Ouro';
    }

    if (this.score >= 500) {
      return 'Prata';
    }

    return 'Bronze';
  }

  // Coleta das perguntas Boolean
  responderBoolean(resposta: 'True' | 'False') {

    this.respostas[this.perguntaAtual.id] = resposta;

    if (resposta === 'True') {

      this.score += this.perguntaAtual.sim.points;

      this.irParaPergunta(
        this.perguntaAtual.sim.nextId
      );

    } else {

      this.score += this.perguntaAtual.não.points;

      this.irParaPergunta(
        this.perguntaAtual.não.nextId
      );
    }
  }

  // Navegação entre perguntas
  irParaPergunta(
    nextId: number | null
  ) {

    // Finalizar fluxo
    if (nextId === null) {

      this.telaAtual = 'resultado';

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

  // Finalizar atendimento
finalizarAtendimentoFila() {
  
  // APRESENTAR VARIAVEIS NO CONSOLE
  console.log(this.respostas);

  const atendimento = {

    vendedor_id: 1,

    loja: 'Matriz',

    score: this.score,

    ranking: this.ranking,

    orcamento: this.respostas[2],

    concorrentes: this.respostas[7] ?? null,

    gerou_follow: this.respostas[3] ?? 'False',

    data_follow: this.respostas[4] ?? null,

    respostas: this.respostas
  };
  console.log(atendimento);

  this.apiService
    .criarAtendimento(atendimento)
    .subscribe({

      next: (resposta: any) => {
        
        console.log(
          'Atendimento salvo',
          resposta
        );

        this.router.navigate(
          ['/home/fila']
        );

      },

      error: (erro: any) => {

        console.error(
          'Erro ao salvar',
          erro.error
        );

      }
    });
  }
}