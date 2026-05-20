import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  // Controle de telas
  telaAtual: string = 'jogo';

  // Pontuação total
  score: number = 0;

  // Índice da pergunta atual
  currentIndex: number = 0;

  // Estrutura das perguntas
  questions = [

    {
      id: 1,

      category: 'Orçamento',

      type: 'boolean',

      text: 'Foi gerado orçamento?',

      sim: {
        points: 300,
        nextQuestion: 'Qual o número do orçamento?',
        nextId: 2
      },

      nao: {
        points: -100,
        nextQuestion: 'Cliente deseja follow-up?',
        nextId: 3
      }
    },

    {
      id: 2,

      category: 'Orçamento',

      type: 'input',

      text: 'Qual o número do orçamento?',

      placeholder: 'Digite o número do orçamento',

      value: '',

      points: 0,

      nextId: 3
    },

    {
      id: 3,

      category: 'Arena competitiva',

      type: 'boolean',

      text: 'Você conseguiu descobri quem serão nossos concorrentes?',

      sim: {
        points: 300,
        nextQuestion: 'Digite o nome dos concorrentes',
        nextId: 4
      },

      nao: {
        points: -100,
        nextQuestion: 'Neste atendimento, o que mais pesou na decisão do cliente?',
        nextId: 5
      }
    },

    {
      id: 4,

      category: 'Arena competitiva',

      type: 'input',

      text: 'Cite nossos concorrentes',

      placeholder: 'Digite o nome dos concorrentes',

      value: '',

      points: 0,

      nextId: 5
    },
    {
      id: 5,

      category: 'Arena competitiva',

      type: 'select',

      text: 'Neste atendimento, o que mais pesou na decisão do cliente?',

      options: [

        {
          label: 'Preço',
          points: 100,
          nextId: 6
        },

        {
          label: 'Designer / Estética',
          points: 100,
          nextId: 6
        },

        {
          label: 'Conforto / Uso',
          points: 100,
          nextId: 6
        },

        {
          label: 'Confiança / Segurança',
          points: 100,
          nextId: 6
        },
        
        {
          label: 'Prazo',
          points: 100,
          nextId: 6
        },
        
        {
          label: 'Relacionamento (Arquiteto / Indicação)',
          points: 100,
          nextId: 6
        }
      ]
    },
    {
      id: 6,

      category: 'PadraoBrentwood',

      type: 'boolean',

      text: 'Você entendeu corretamente o que realmente importa para esse cliente?',

      sim: {
        points: 300,
        nextQuestion: 'Digite o nome dos concorrentes',
        nextId: 7
      },

      nao: {
        points: -100,
        nextQuestion: 'Neste atendimento, o que mais pesou na decisão do cliente?',
        nextId: 7
      }
    },
    {
      id: 7,

      category: 'PadraoBrentwood',

      type: 'select',

      text: 'Conduzi o atendimento com segurança e naturalidade?',

      options: [

        {
          label: 'Sim',
          points: 100,
          nextId: 8
        },

        {
          label: 'Parcialmente',
          points: 50,
          nextId: 8
        },

        {
          label: 'Não',
          points: -100,
          nextId: 8
        },
      ]
    },
    {
      id: 8,

      category: 'PadraoBrentwood',

      type: 'select',

      text: 'Entendi como o cliente vive e o que ele valoriza?',

      options: [

        {
          label: 'Sim',
          points: 100,
          nextId: 9
        },

        {
          label: 'Parcialmente',
          points: 50,
          nextId: 9
        },

        {
          label: 'Não',
          points: -100,
          nextId: 9
        },
      ]
    },    
    {
      id: 9,

      category: 'PadraoBrentwood',

      type: 'select',

      text: 'Deixei o cliente conduzir a conversa',

      options: [

        {
          label: 'Sim',
          points: -100,
          nextId: 10
        },

        {
          label: 'Parcialmente',
          points: 0,
          nextId: 10
        },

        {
          label: 'Não',
          points: 100,
          nextId: 10
        },
      ]
    },
    {
      id: 10,

      category: 'PadraoBrentwood',

      type: 'select',

      text: 'Apresentei soluções coerentes com o perfil do cliente?',

      options: [

        {
          label: 'Sim',
          points: 100,
          nextId: 11
        },

        {
          label: 'Parcialmente',
          points: 50,
          nextId: 11
        },

        {
          label: 'Não',
          points: -100,
          nextId: 11
        },
      ]
    },
    {
      id: 11,

      category: 'PadraoBrentwood',

      type: 'select',

      text: 'Foquei o valor da conversa falando apenas do produto',

      options: [

        {
          label: 'Sim',
          points: -100,
          nextId: 12
        },

        {
          label: 'Parcialmente',
          points: 50,
          nextId: 12
        },

        {
          label: 'Não',
          points: 100,
          nextId: 12
        },
      ]
    },
    {
      id: 12,

      category: 'Orçamento',

      type: 'select',

      text: 'Qual será o próximo movimento com esse cliente?',

      options: [

        {
          label: 'Agendar uma nova visita',
          points: 50,
          nextId: 14
        },

        {
          label: 'Apresentar o orçamento',
          points: 100,
          nextId: 14
        },

        {
          label: 'Contatar via whatsapp / e-mail',
          points: 50,
          nextId: 14
        },

        {
          label: 'Aguardar decisão de terceiros',
          points: -50,
          nextId: 14
        },
        {
          label: 'Conversar com o profissional',
          points: 0,
          nextId: 14
        },
      ]
    },
    {
      id: 13,

      category: 'Orçamento',

      type: 'boolean',

      text: 'Esse atendimento gerou followup?',

      sim: {
        points: 300,
        nextQuestion: 'Qual será o próximo movimento com esse cliente?',
        nextId: 14
      },

      nao: {
        points: -100,
        nextQuestion: 'Finalizar atendimento',
        nextId: null
      }
    },
    {
      id: 14,

      category: 'Follow-up',

      type: 'date',

      text: 'Qual a data do próximo contato?',

      value: '',

      points: 100,

      nextId: null
    }
  ];

  constructor(
    private router: Router
  ) {}

  // Variável para armazenar o valor digitado
  respostaInput: string = '';

  // Responder pergunta de input
  responderInput() {

    // Bloqueia vazio
    if (
      !this.respostaInput ||
      this.respostaInput.trim() === ''
    ) {
      return;
    }

    // Salva resposta
    this.perguntaAtual.value = this.respostaInput;

    // Soma pontos
    this.score += this.perguntaAtual.points || 0;

    // Próxima pergunta
    this.irParaPergunta(
      this.perguntaAtual.nextId
    );

    // Limpa campo
    this.respostaInput = '';

  }

  // Pergunta atual
  get perguntaAtual(): any {

    return this.questions[this.currentIndex];

  }

  // Responder pergunta do Select
  responderSelect(option: any) {

    // Soma pontuação
    this.score += option.points;

    // Próxima pergunta
    this.irParaPergunta(
      option.nextId
    );

  }

  // Ranking baseado na pontuação
  get ranking(): string {

    if (this.score >= 5000) {
      return 'Diamante';
    }

    if (this.score >= 3500) {
      return 'Ouro';
    }

    if (this.score >= 2000) {
      return 'Prata';
    }

    return 'Bronze';
  }

  // Resposta SIM
  responderSim() {

    if (!this.perguntaAtual.sim) return;

    // Soma pontos
    this.score += this.perguntaAtual.sim.points;

    // Navegação
    this.irParaPergunta(
      this.perguntaAtual.sim.nextId
    );

  }

  // Resposta NÃO
  responderNao() {

    if (!this.perguntaAtual.nao) return;

    // Soma pontos
    this.score += this.perguntaAtual.nao.points;

    // Navegação
    this.irParaPergunta(
      this.perguntaAtual.nao.nextId
    );

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
  finalizarAtendimento() {

    this.router.navigate(
      ['/home/fila']
    );

  }

}