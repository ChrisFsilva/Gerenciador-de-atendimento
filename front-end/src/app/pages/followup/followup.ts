import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowupServices } from '../../services/followup/followup.service';
import { FollowsModel } from '../../models/follow.model';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


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


  // Variavel para coletar as informações do banco de dados
  follows: FollowsModel[] = [];

  // Variavel para filtrar a data de entrega (atrasados)
  followsAtrasados: FollowsModel[] = [];

  // Variavel para filtrar a data de entrega (hoje)
  followsHoje: FollowsModel[] = [];

  followsnextday: FollowsModel[] = [];

  // Varivael par identificar o card selecionado
  followSelecionado: FollowsModel | null = null;

  // Variavel para abrir o card selecionado
  modalAberto: boolean = false;

  // Variavel para identificar a ação selecionada no follow
  acaoSelecionada: string = '';
  // Consultar histórico de follows
  historicoFollows: FollowsModel[] = [];

  estagiosAtrasados: { [key: string]: number } = {};
  estagiosHoje: { [key: string]: number } = {};
  estagiosAmanha: { [key: string]: number } = {};

  // Variavel para definir status do agendamento
  statusEncerramento:
    | 'Não realizou o follow'
    | 'Encerrado Brentwood'
    | 'Encerrado concorrência'
    | 'Em follow'
    = 'Em follow';


  constructor(
    private followServices: FollowupServices,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.atualizarStatusAtrasado()
    this.carregarFollows();
    this.cdr.detectChanges()
  }

  // Função para carregar fila inicial
  carregarFollows() {
    this.followServices
      .obterDados()
      .subscribe({
        next: (dados) => {
          this.follows = dados
          this.filtrarCards()
          this.cdr.detectChanges()
        }
    });
  }

  // Função para filtrar as filas de agendamento
  filtrarCards() {
    const hoje = new Date();
    const hojeFormatado = this.formatarDataLocal(hoje);

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    const amanhaFormatado = this.formatarDataLocal(amanha);

    console.log('Hoje: ', hojeFormatado)
    console.log('Amanhã: ', amanhaFormatado)

    this.followsHoje = this.follows.filter(
      follow =>
        follow.date_agenda.startsWith(hojeFormatado) && (
          follow.status == 'Em follow' ||
          follow.status == 'Não realizou o follow'
        )
    );

    this.followsAtrasados = this.follows.filter(
      follow =>
        follow.date_agenda < hojeFormatado &&
        (
          follow.status === 'Em follow'
          ||
          follow.status === 'Não realizou o follow'
        ),
    );
    
    this.followsnextday = this.follows.filter(
      follow =>
        follow.date_agenda.startsWith(amanhaFormatado) &&
        (
          follow.status === 'Em follow'
          ||
          follow.status === 'Não realizou o follow'
        ),
    );

    this.estagiosAtrasados = this.contarEstagios(this.followsAtrasados);

    this.estagiosHoje = this.contarEstagios(this.followsHoje);

    this.estagiosAmanha = this.contarEstagios(this.followsnextday);
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

    // this.followServices
    //   .obterAtendimento(
    //     follow.atendimento_id
    //   )
    //   .subscribe({

    //     next: (dados) => {
    //       this.dadosAtendimento = dados;
    //     },

    //     error: (erro) => {

    //       console.error(
    //         'Erro ao carregar atendimento',
    //         erro
    //       );

    //     }
    //   });
  }

  // Função para fechar modal
  fecharModal() {
    console.log("FECHANDO MODAL");
    this.modalAberto = false;

    this.acaoSelecionada = '';

    console.log('Modal Fechado com sucesso')

  }

  // Função para reagendar o follow
  abrirReagendamento() {
    console.log("ABRINDO REAGENDAMENTO");
    this.acaoSelecionada = 'reagendar';
    
    // Limpa formulário
    this.respostasReagendamento = {
    estagio: '',
    prioridade: '',
    situation: '',
    contact_form: '',
    final_date: '',
    date_agenda: ''
    };
  }

  // Função para finalizar follow
  abrirEncerramento() {
    console.log("ABRINDO ENCERRAMENTO");
    this.acaoSelecionada = 'finalizar';
  }

  // Função para reagendar follow
  confirmaReagendamento() {
    console.log('INICIO REAGENDAMENTO');
    if (!this.followSelecionado) {
      return;
    }

    const follow = this.followSelecionado;

    const novoFollow = {
      date_agenda: this.novaData,

      estagio: follow.estagio,

      status: 'Em follow',

      prioridade: follow.prioridade,

      situation: follow.situation,

      contact_form: follow.contact_form,

      final_date: follow.final_date,

      follow_parent_id: follow.follow_parent_id ?? follow.id,

      erp_order_id: follow.erp_order_id,

      valor: follow.valor,

      erp_profissional_id: follow.erp_profissional_id,

      profissional_name: follow.profissional_name,

      profissional_mail: follow.profissional_mail,

      erp_client_id: follow.erp_client_id,

      client_name: follow.client_name,

      telefone: follow.telefone,

      email: follow.email
    };

    this.followServices
      .atualizarFollow(
        this.followSelecionado.id,
        {
          Status: 'Reagendado'
        }
      )
      
    this.followServices
      .criarFollow(novoFollow)
      .subscribe({
        next: () => {
          console.log('Novo follow criado com sucesso');

          this.fecharModal();
          this.carregarFollows();
        },

        error: (erro: any) => {
          console.error(
            'Erro ao criar novo follow:', erro
          );
        }
      });
  };

  confirmaEncerramento() {
    console.log("CONFIRMANDO ENCERRAMENTO");
    if (this.followSelecionado) {
      
      this.fecharModal();

      this.followSelecionado.status = this.statusEncerramento;

      this.filtrarCards();

      this.followServices.atualizarFollow(
        this.followSelecionado.id,
        {
          Status: this.statusEncerramento
        }
      )
      .subscribe({
        next: () => {
          console.log('Follow atualizado com sucesso');
        },

        error: (erro: HttpErrorResponse) => {
          console.error(
            'Erro ao atualizar follow:',
            erro
          );
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
  
  atualizarStatusAtrasado() {
    const hojeFormatado = this.formatarDataLocal(new Date());

    const idsParaAtualizar = this.follows
        .filter(follow =>
            follow.date_agenda < hojeFormatado &&
            follow.status === 'Em follow'
        )
        .map(follow => follow.id);
        
    if (idsParaAtualizar.length > 0){
      this.followServices.atualizarFollowsLote(
        idsParaAtualizar,
          'Não realizou o follow'
      ).subscribe({
        next: (res) => {
          console.log(`${res.quantidade} follows atualizados`);

          this.filtrarCards();
        },
        error: (erro) => {
          console.error('Erro ao atualizar lote:', erro.error);
          console.log(erro.error.detail);
        }
      });
    }
  }

  contarEstagios(lista: FollowsModel[]) {
    const resultado: { [key: string]: number } = {};

    lista.forEach(follow => {
      const estagio = follow.estagio || 'Sem estágio';

      resultado[estagio] = (resultado[estagio] || 0) + 1;
    });

    return resultado;
  }
}