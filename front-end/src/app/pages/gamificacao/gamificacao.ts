import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api';
import { ToastService } from '../../services/toast/toast.service';

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

  emAndamento = true;

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
          nextId: null
        },

        {
          label: 'Orçamento futuro',
          points: 500,
          nextId: 101
        },

        {
          label: 'Sim',
          points: 100,
          nextId: 3
        },
        {
          label: 'Venda ato',
          points: 1000,
          nextId: 9
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
        nextId: 8
      },
      não: {
        points: -300,
        nextId: 9
      },
    },
    {
      id: 8,

      category: 'Follow-up',

      type: 'datetime-local',

      text: 'Qual a data limite do cliente?',

      value: '',

      points: 0,

      nextId: 9
    },
    {
      id: 9,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Utilizei a abordagem Brentwood?',

      sim: {
        points: 100,
        nextId: 10
      },
      não: {
        points: -100,
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
        nextId: 11
      },
      não: {
        points: -100,
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
        nextId: 12
      },
      não: {
        points: -100,
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
        nextId: 13
      },
      não: {
        points: -100,
        nextId: 13
      },
    },
    {
      id: 13,

      category: 'Sondagem',

      type: 'select',

      text: 'Neste projeto há profissional auxiliando no processo de decisão?',

      options: [

        {
          label: 'Sim',
          points: 100,
          nextId: 14
        },

        {
          label: 'Não',
          points: 100,
          nextId: 14
        },

        {
          label: 'Não descobri',
          points: -100,
          nextId: 14
        },
      ]
    },
    {
      id: 14,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri o produto inicial?',

      sim: {
        points: 100,
        nextId: 15
      },
      não: {
        points: -100,
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
        nextId: 16
      },
      não: {
        points: -100,
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
        nextId: 17
      },
      não: {
        points: -100,
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
        nextId: 18
      },
      não: {
        points: -100,
        nextId: 18
      },
    },
    {
      id: 18,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri como será utilizado os produtos iniciais?',

      sim: {
        points: 100,
        nextId: 19
      },
      não: {
        points: -100,
        nextId: 19
      },
    },
    {
      id: 19,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri experiências que possam ter gerado insatisfações?',

      sim: {
        points: 100,
        nextId: 20
      },
      não: {
        points: -100,
        nextId: 20
      },
    },
    {
      id: 20,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri o valor real para o cliente?',

      sim: {
        points: 100,
        nextId: 21
      },
      não: {
        points: -100,
        nextId: 21
      },
    },
    {
      id: 21,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri a arena competitiva?',

      sim: {
        points: 100,
        nextId: 22
      },
      não: {
        points: -100,
        nextId: 22
      },
    },
    {
      id: 22,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri o valor que o cliente pretente investir?',

      sim: {
        points: 100,
        nextId: 23
      },
      não: {
        points: -100,
        nextId: 23
      },
    },
    {
      id: 23,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Utilizei a forma de demonstração Brentwood?',

      sim: {
        points: 100,
        nextId: 24
      },
      não: {
        points: -100,
        nextId: 24
      },
    },
    {
      id: 24,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Estabeleci o que é "valor" para o cliente?',

      sim: {
        points: 100,
        nextId: 25
      },
      não: {
        points: -100,
        nextId: 25
      },
    },
        {
      id: 25,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Utilizei a forma de contorno de objeções Brentwood?',

      sim: {
        points: 100,
        nextId: 26
      },
      não: {
        points: -100,
        nextId: 26
      },
    },
    {
      id: 26,

      category: 'Sondagem',

      type: 'boolean',

      text: 'Descobri a verdadeira objeção?',

      sim: {
        points: 100,
        nextId: null
      },
      não: {
        points: -100,
        nextId: null
      },
    },

    // PERGUNTAS DE ORÇAMENTO FUTURO

    {
      id: 101,

      category: 'Follow-up',

      type: 'input',

      text: 'Qual é o nome do cliente?',

      placeholder: 'Digite um nome que facilitará o reconhecimento dele',

      value: '',

      points: 0,

      nextId: 102
    },

    {
      id: 102,

      category: 'Follow-up',

      type: 'datetime-local',

      text: 'Qual a data do próximo contato?',

      value: '',

      points: 0,

      nextId: 103
    },
    {
      id: 103,

      category: 'Follow-up',

      type: 'select',

      text: 'Como ficou o alinhado o contato com o cliente?',

      options: [

        {
          label: 'Whatsapp',
          points: 100,
          nextId: 104
        },

        {
          label: 'E-mail',
          points: 100,
          nextId: 105
        },

        {
          label: 'Visita na loja',
          points: 100,
          nextId: 104
        },
      ]
    },
    {
      id: 104,

      category: 'Follow-up',

      type: 'input',

      text: 'Qual o número do telefone do cliente?',

      placeholder: 'Digite o número de contato do telefone em que o whatsapp está cadastrado',

      value: '',

      points: 0,

      nextId: 105
    },
    {
      id: 105,

      category: 'Follow-up',

      type: 'input',

      text: 'Qual o endereço de e-mail do cliente?',

      placeholder: 'Digite o e-mail de contato do cliente',

      value: '',

      points: 0,

      nextId: 9
    },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService
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
      
      (this.perguntaAtual as any).nextId);
      
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
  get ranking(): number {

    if (this.score >= 2600) return 5;
    if (this.score >= 2200) return 4;
    if (this.score >= 2000) return 3;
    if (this.score >= 1200) return 2;

    return 1;
  }

  get estrelas(): boolean[] {
      return Array.from(
          { length: 5 },
          (_, i) => i < this.ranking
      );
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

    console.log("Próximo ID:", nextId);

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

  encerrarGamificacao() {
    if (this.tipoFluxo === 'orcamento_futuro') {
      this.finalizarOrcamentoFuturo();
    } else {
      this.finalizarAtendimentoFila();
    }
  }

  // Finalizar atendimento
  finalizarAtendimentoFila() {

    if (this.emAndamento === false) {
      return;
    }

    this.toastService.info('Salvando agendamento');
    
    const atendimento = {

      score: this.score,

      ranking: this.ranking,

      orcamento: this.respostas[3] ?? 'Não gerou orçamento',

      concorrentes: this.respostas[6] ?? 'Não mencionado',

      gerou_follow: this.respostas[2],

      data_follow: this.respostas[4] ?? null,

      respostas: this.respostas
    };
    console.log(atendimento);
    
    const follow = {
      Date_Agenda: this.respostas[4],

      Estagio: "Agendamento realizado",
      
      Status: "Em follow",
      
      Prioridade: "Média",
      
      Situation: "Ativo",
      
      Contact_Form: this.respostas[5],
      
      Final_Date: this.respostas[8]
    };
    
    console.log(follow);

    const dados = { 
      atendimento: atendimento,
      follow: this.respostas[2] === 'Sim'
        ? follow
        : null
    }
    this.emAndamento = false;
    console.log('Tipo de atendimento:', this.respostas[2]);
    console.log('Dados enviados:', dados);

    this.apiService
      .criarAtendimento(dados)
      .subscribe({

        next: (resposta: any) => {

          this.toastService.success(
            'Atendimento registrado com sucesso',
          );
          
          console.log(
            'Atendimento salvo',
            resposta
          );

        },

        error: (erro: any) => { if (erro.status === 403) 
          { this.toastService.error( 'O orçamento pertence a outro vendedor.' ); } 
            else 
              { this.toastService.error( 'Erro no registro do atendimento, contate o seu TI' ); } 
              console.error
                ( 'Erro ao salvar', erro.error ); 
            }
      });

    this.router.navigate(['/home/fila']);
  }

  finalizarOrcamentoFuturo() {

    const dataAgendamento = this.respostas[102];
    const orcamentoFuturo ={
      cliente: this.respostas[101],

      telefone : this.respostas[104],
      
      email : this.respostas[105],

      forma_contato : this.respostas[103],

      data_contato : this.respostas[102],

      vendedor_id : "",
      
      loja_id : "",

      status: "Ativo",

      data_criacao : "",
    };
    this.apiService
      .criarOrcamentoFuturo(orcamentoFuturo)
      .subscribe({

        next: (resposta: any) => {

          this.toastService.success(
            'Orçamento futuro agendado com sucesso',
          );
          
          console.log(
            'orçamento futuro salvo',
            resposta
          );
          this.emAndamento = false;
          this.router.navigate(
            ['/home/fila']
          );

        },

      error: (erro: any) => {

        this.toastService.error(
          'Erro no agendamento do orçamento futuro, contate o seu TI',
        );

        console.error(
          'Erro ao salvar',
          console.log(erro.error)
        );

      }
    });
  }
}