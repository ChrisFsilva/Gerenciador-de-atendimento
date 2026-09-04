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

  // | ------------------------------------ |
  // | - CRIAÇÃO DAS ABAS DENTRO DO MODAL - |
  // | ------------------------------------ |
  abaSelecionada: 
    'detalhes' 
    | 'perguntas' 
    | 'followsHistorico' 
    | 'infoProfissional' 
    | 'orcamento'
    = 'detalhes';

  // respostasAtendimento: any[] = [];

  dadosAtendimento: any = null;

  // Variaveis de reagendamento
  respostasReagendamento: any = {};

  scoreReagendamento: number = 0;

  rankingReagendamento: string = '';

  // | ------------------------------------ |
  // | -- VAR PARA DATA DO REAGENDAMENTO -- |
  // | ------------------------------------ |
  novaData: string = ''; 
  // | ------------------------------------ |
  // | ----- COLETAR INFORMAÇÕES DO BD ---- |
  // | ------------------------------------ |
  follows: FollowsModel[] = [];

  // | ------------------------------------ |
  // | ----- CALCULAR DATA PARA ATRASO ---- |
  // | ------------------------------------ |
  followsAtrasados: FollowsModel[] = [];

  // | ------------------------------------ |
  // | ----- CALCULAR DATA PARA HOJE ------ |
  // | ------------------------------------ |
  followsHoje: FollowsModel[] = [];

  // | ------------------------------------ |
  // | ----- CALCULAR DATA PARA AMANHÃ ---- |
  // | ------------------------------------ |
  followsnextday: FollowsModel[] = [];

  // | ------------------------------------ |
  // | --- IDENTIFICAR CARD SELECIONADO --- |
  // | ------------------------------------ |
  followSelecionado: FollowsModel | null = null;

  // | ------------------------------------ |
  // | --- REGISTRAR O CARD COMO ABERTO --- |
  // | ------------------------------------ |
  modalAberto: boolean = false;

  // | ------------------------------------ |
  // | ---- AÇÃO SELECIONADA NO FOLLOW ---- |
  // | ------------------------------------ |
  acaoSelecionada: string = '';

  // | ------------------------------------ |
  // | -------- HISTÓRICO DO FOLLOW ------- |
  // | ------------------------------------ |
  historicoFollows: FollowsModel[] = [];

  // | ----------------------------------------- |
  // | VAR QUE CONTA A QTN DE FOLLOWS POR COLUNA |
  // | ----------------------------------------- |
  estagiosAtrasados: { [key: string]: number } = {};
  estagiosHoje: { [key: string]: number } = {};
  estagiosAmanha: { [key: string]: number } = {};

  // | ------------------------------------ |
  // | -- OPÇÕES DE ESTAGIO DOS FOLLOWS --- |
  // | ------------------------------------ |
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

  // | ------------------------------------ |
  // | -- APRESENTAR OS FOLLOWS NA TELA --- |
  // | ------------------------------------ |
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

  // | ------------------------------------ |
  // | -------- FILTRO DAS COLUNAS -------- |
  // | ------------------------------------ |
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
  // | ------------------------------------- |
  // | - FUNÇÃO PARA MODELAR VALOR EM REAL - |
  // | ------------------------------------- |

  formatarValor(valor: number | string): string {
    const numero = Number(valor);

    if (isNaN(numero)) {
      return 'R$ 0,00';
    }

    return 'R$ ' + numero
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  // | ------------------------------------ |
  // | ---- EXPANDIR CARD SELECIONADO ----- |
  // | ------------------------------------ |
  abrirModal(follow: FollowsModel) {

    this.followSelecionado = follow;

    this.modalAberto = true;

    this.abaSelecionada = 'detalhes';

    this.acaoSelecionada = '';

  // | ------------------------------------------- |
  // |  CARREGAR FOLLOWS COM PARENT_ID COMPATIVEIS |
  // | ------------------------------------------- |
    this.historicoFollows = this.follows.filter(f => {

  // | ------------------------------------ |
  // | ---- COMPARAR PARENTS_ID ---- |
  // | ------------------------------------ |
      if (follow.follow_parent_id) {

        return (
          f.follow_parent_id === follow.follow_parent_id
          || f.id === follow.follow_parent_id
        );
      }

  // | ---------------------------------------- |
  // | IDENTIFICAR O PRIMEIRO FOLLOW DA CADEIRA |
  // | ---------------------------------------- |
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

  // | ------------------------------------ |
  // | ---- AÇÃO DE FECHAR CARD ABERTO ---- |
  // | ------------------------------------ |
  fecharModal() {
    console.log("FECHANDO MODAL");
    this.modalAberto = false;

    this.acaoSelecionada = '';

    console.log('Modal Fechado com sucesso')

  }

  // | ------------------------------------ |
  // | - INICIAR REAGENDAMENTO DE FOLLOWS - |
  // | ------------------------------------ |
  abrirReagendamento() {
    console.log("ABRINDO REAGENDAMENTO");
    this.acaoSelecionada = 'reagendar';
    
  // | ------------------------------------ |
  // | ---- APRESENTAR FORMULARIO LIMPO --- |
  // | ------------------------------------ |
    this.respostasReagendamento = {
    estagio: '',
    prioridade: '',
    situation: '',
    contact_form: '',
    final_date: '',
    date_agenda: ''
    };
  }

  // | ------------------------------------ |
  // | -------- ENCERRAR FOLLOW ----------- |
  // | ------------------------------------ |
  abrirEncerramento() {
    console.log("ABRINDO ENCERRAMENTO");
    this.acaoSelecionada = 'finalizar';
  }

  // | ------------------------------------ |
  // | --------- REAGENDAR FOLLOW --------- |
  // | ------------------------------------ |
  confirmaReagendamento() {
    console.log('INICIO REAGENDAMENTO');
    if (!this.followSelecionado) {
      return;
    }

  // | -------------------------------------------- |
  // | ---- ARMAZENAR ID DO FOLLOW SELECIOANDO ---- |
  // | -------------------------------------------- |
    const follow = this.followSelecionado;

  // | ---------------------------------------- |
  // | - ARMAZENAR INFORMAÇÕES DO NOVO FOLLOW - |
  // | ---------------------------------------- |
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
  // | ----------------------------------------- |
  // | ---- FUNÇÃO PARA ALTERAR CARD ANTIGO ---- |
  // | ----------------------------------------- |
    this.followServices
      .atualizarFollow(
        this.followSelecionado.id,
        {
          Status: 'Reagendado'
        }
      )
      .subscribe({

        next: () => {

          console.log('Follow antigo atualizado com sucesso');
          this.fecharModal();

          // | ------------------------------------- |
          // | ---- FUNÇÃO PARA CRIAR NOVO CARD ---- |
          // | ------------------------------------- |
          this.followServices
            .criarFollow(novoFollow)
            .subscribe({

              next: () => {
                
                this.carregarFollows();

                console.log(
                  'Novo follow criado com sucesso'
                );
              },

              error: (erro: any) => {

                console.error(
                  'Erro ao criar novo follow:',
                  erro
                );
              }
            });
        },

        error: (erro: HttpErrorResponse) => {

          console.error(
            'Erro ao atualizar follow antigo:',
            erro
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

  // | ------------------------------------------ |
  // | - FUNÇÃO PARA IDENTIFICAR A DATA DE HOJE - |
  // | ------------------------------------------ |
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
  
// | ------------------------------------------------- |
// | - FUNÇÃO PARA ALTERAR STATUS DE CARDS ATRASADOS - |
// | ------------------------------------------------- |
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