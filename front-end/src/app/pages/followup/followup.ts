import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowupServices } from '../../services/followup/followup.service';
import { FollowsModel } from '../../models/follow.model';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api';

@Component({
  selector: 'app-followup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './followup.html',
  styleUrl: './followup.css',
})

export class Followup implements OnInit {

  // Variavel para escolha de aba do card
  abaSelecionada: 'detalhes' | 'perguntas' | 'followsHistorico' = 'detalhes';

  // respostasAtendimento: any[] = [];

  dadosAtendimento: any = null;

  // Variaveis de reagendamento
  respostasReagendamento: any = {};

  scoreReagendamento: number = 0;

  rankingReagendamento: string = '';

  // Variavel de data e hora
    // Variavel para a nova data de reagendamento
  novaData: string = ''; 

  // Variavel para nova hora do reagendamento
  novaHora: string = '';

  // Variavel para coletar as informações do banco de dados
  follows: FollowsModel[] = [];

  // Variavel para calcular a data de entrega (atrasados)
  followsAtrasados: FollowsModel[] = [];

  // Variavel para filtrar a data de entrega (hoje)
  followsHoje: FollowsModel[] = [];

  // Varivael par identificar o card selecionado
  followSelecionado: FollowsModel | null = null;

  // Variavel para abrir o card selecionado
  modalAberto: boolean = false;

  // Variavel para identificar a ação selecionada no follow
  acaoSelecionada: string = '';
  // Consultar histórico de follows
  historicoFollows: FollowsModel[] = [];

  // Variavel para definir status do agendamento
  statusEncerramento:
    | 'Não realizou o follow'
    | 'Encerrado Brentwood'
    | 'Encerrado concorrência'
    | 'Em follow'
    = 'Em follow';

  constructor(
    private followServices: FollowupServices,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    this.followServices
      .obterFollowup()
      .subscribe((dados) => {

        this.follows = dados;

        this.atualizarCards();

      });
  }

  // Função para carregar fila inicial
  carregarFollows() {

    this.followServices
      .obterFollowup()
      .subscribe((dados) => {

        this.follows = dados;

        this.atualizarCards();

      });
  }

  // Função para atualizar as filas de agendamento
  atualizarCards() {
    
    this.atualizarStatusAtrasados();

    const hojeFormatado = this.formatarDataLocal(
      new Date()
    );

    this.followsHoje = this.follows.filter(
      follow =>
        follow.data_agendamento === hojeFormatado
        && follow.status === 'Em follow'
        || follow.data_agendamento === hojeFormatado
        && follow.status === 'Não realizou o follow'
    );

    this.followsAtrasados = this.follows.filter(
      follow =>
        follow.data_agendamento < hojeFormatado 
        && follow.status === 'Em follow'
        || follow.data_agendamento < hojeFormatado 
        && follow.status === 'Não realizou o follow'
    );
  }

  // Função expandir o card selecionado
  abrirModal(follow: FollowsModel) {

    this.followSelecionado = follow;

    this.modalAberto = true;

    this.abaSelecionada = 'detalhes';

    this.acaoSelecionada = '';

    // Carrega histórico de follows
    this.historicoFollows = this.follows.filter(f => {

      // Se o follow tiver parent_id
      if (follow.follow_parent_id) {

        return (
          f.follow_parent_id === follow.follow_parent_id
          || f.id === follow.follow_parent_id
        );
      }

      // Se for o primeiro follow da cadeia
      return (
        f.id === follow.id
        || f.follow_parent_id === follow.id
      );
    });

    this.followServices
      .obterAtendimento(
        follow.atendimento_id
      )
      .subscribe({

        next: (dados) => {

          this.dadosAtendimento = dados;

        },

        error: (erro) => {

          console.error(
            'Erro ao carregar atendimento',
            erro
          );

        }
      });
  }

  // Função para fechar modal
  fecharModal() {

    this.modalAberto = false;

    this.acaoSelecionada = '';

  }

  // Função para reagendar o follow
  abrirReagendamento() {

    this.acaoSelecionada = 'reagendar';
    
    // Limpa formulário
    this.respostasReagendamento = {
      nivel_atendimento: '',
      possibilidade: '',
      estagio: '',
      melhoria: '',
      obs_follow: '',
      estrategia: '',
      prazo_final: ''
    };
  }

  // Função para finalizar follow
  abrirEncerramento() {

    this.acaoSelecionada = 'finalizar';

  }

  // Função para reagendar follow
  confirmaReagendamento() {

    if (!this.followSelecionado) {

      return;

    }

    // INICIALMENTE FOI PLANEJADO PARA QUE O FORMULARIO DE REAGENDAMENTO GERASSE UM NOVO REGISTRO DE ATENDIMENTO, ESSA FUNÇÃO FOI DESATIVADA POIS FOI INTERPRETADO QUE OS REGISTROS DE ATENDIMENTO É REFERENTE ATENDIMENTO LOJA PRESENCIAL, ENQUANTO OS REGISTROS DE FOLLOW DEVEM HAVER UM HISTÓRICO PRÓPRIO
    // // Cria novo atendimento
    // const novoAtendimento = {

    //   vendedor_id: this.followSelecionado.vendedor_id,

    //   loja: this.followSelecionado.loja_id,

    //   score: this.scoreReagendamento,

    //   ranking: this.rankingReagendamento,

    //   orcamento: '',

    //   concorrentes: '',

    //   gerou_follow: true,

    //   data_follow: this.novaData,

    //   respostas: this.respostasReagendamento
    // };
    
    //Atualiza follow antigo
    this.followServices
      .atualizarFollow(
        this.followSelecionado.id,
        {
          status: 'Reagendado'
        }
      )
      
      .subscribe({
        next: () => {
          console.log('Follow atualizado com sucesso');
        },

        error: (erro) => {
          console.error(
            'Erro ao criar atendimento',
            erro
          );
        }
      });


    // Salva atendimento
    // this.apiService
    //   .criarAtendimento(novoAtendimento)
    //   .subscribe({

        // next: (atendimentoCriado: any) => {

          // Cria novo follow
    const novoFollow = {

      cliente: this.followSelecionado?.cliente,

      telefone: this.followSelecionado?.telefone,

      email: this.followSelecionado?.email,

      loja_id: this.followSelecionado?.loja_id,

      vendedor_id: this.followSelecionado?.vendedor_id,

      arquiteto: this.followSelecionado?.arquiteto,

      produto: this.followSelecionado?.produto,

      data_agendamento: this.novaData,

      hora_agendamento: this.novaHora,

      estagio: this.respostasReagendamento.estagio,

      prioridade: this.followSelecionado?.prioridade,

      observacoes: this.followSelecionado?.observacoes,

      status: 'Em follow',

      atendimento_id: this.followSelecionado?.atendimento_id,

      follow_parent_id: this.followSelecionado?.follow_parent_id,
      
      orcamento: this.followSelecionado?.orcamento,

      estrategia: this.respostasReagendamento.estrategia,
      
      obs_follow: this.respostasReagendamento.obs_follow,
      
      prazo_final: this.followSelecionado?.prazo_final,

      forma_contato: this.respostasReagendamento.forma_contato,

      possibilidade: this.respostasReagendamento.possibilidade,
    };

    this.followServices
      .criarFollow(novoFollow)
      .subscribe({

        next: () => {

          this.carregarFollows();

          this.modalAberto = false;

        },

        error: (erro) => {

          console.error(
            'Erro ao criar novo follow',
            
          );
          console.log(erro.error.detail);
        }
      });
  };

  confirmaEncerramento() {

    if (this.followSelecionado) {

      this.followSelecionado.status = this.statusEncerramento;

      this.atualizarCards();

      this.fecharModal();

      this.followServices.atualizarFollow(
        this.followSelecionado.id,
        {
          status: this.statusEncerramento
        }
      )
      .subscribe({
        next: () => {
          console.log('Follow atualizado com suesso');
        },
        error: (erro) => {
          console.error(`erro ao atualizar follow: ${erro}`);
        }
      })
    }
  }

  // Função para definir a data de hoje
  private formatarDataLocal(data: Date): string {

    const ano = data.getFullYear();

    const mes = String(
      data.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      data.getDate()
    ).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  // INICIALMENTE FOI PLANEJADO PARA QUE O FORMULARIO DE REAGENDAMENTO GERASSE UM NOVO REGISTRO DE ATENDIMENTO, ESSA FUNÇÃO FOI DESATIVADA POIS FOI INTERPRETADO QUE OS REGISTROS DE ATENDIMENTO É REFERENTE ATENDIMENTO LOJA PRESENCIAL, ENQUANTO OS REGISTROS DE FOLLOW DEVEM HAVER UM HISTÓRICO PRÓPRIO

  // calcularScoreReagendamento() {

  //   let score = 0;

  //   if (
  //     this.respostasReagendamento.seguranca === 'Sim'
  //   ) {

  //     score += 100;

  //   }

  //   if (
  //     this.respostasReagendamento.entendimento === 'Sim'
  //   ) {

  //     score += 100;

  //   }

  //   if (
  //     this.respostasReagendamento.nivel_atendimento === 'Diferencial Brentwood'
  //   ) {

  //     score += 300;

  //   }

  //   this.scoreReagendamento = score;

  //   if (score >= 400) {

  //     this.rankingReagendamento = 'Diamante';

  //   }
  //   else if (score >= 250) {

  //     this.rankingReagendamento = 'Ouro';

  //   }
  //   else {

  //     this.rankingReagendamento = 'Prata';

  //   }
  // }

  // Função para atualizar follows colocando eles para atrasado
  atualizarStatusAtrasados() {

    const hojeFormatado = this.formatarDataLocal(
      new Date()
    );

    this.follows.forEach(follow => {

      if (
        follow.data_agendamento < hojeFormatado &&
        follow.status !== 'Reagendado' &&
        follow.status !== 'Não realizou o follow'
      ) {

        follow.status = 'Não realizou o follow';

        this.followServices
          .atualizarFollow(
            follow.id,
            {
              status: 'Não realizou o follow'
            }
          )
          .subscribe({
            error: (erro) => {

              console.error(
                'Erro ao atualizar follow atrasado',
                erro
              );

            }
          });
      }
    });
  }
}