import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowupServices } from '../../services/followup/followup.service';
import { FollowsModel } from '../../models/follow.model';
import { FormsModule } from '@angular/forms';

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
export class Followup implements OnInit{

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
  acaoSelecionada: string ='';
  // Variavel para a nova data de reagendamento
  novaData: string =''; 
  // Variavel para definir status do agendamento
  statusEncerramento:
        |'Não realizou o follow'
        |'Encerrado Brentwood'
        |'Encerrado concorrência'
        |'Em follow'
        = 'Em follow';
  constructor(
  private followServices: FollowupServices,
  ){}

  ngOnInit(): void{

    this.followServices.obterFollowup().subscribe((dados)=>{

      this.follows = dados;

      this.atualizarCards();

    });
  }
  // Função para carregar fila inicial
  carregarFollows(){
    this.followServices.obterFollowup().subscribe((dados)=>{
      this.follows = dados;

      this.atualizarCards();
    });
  }
  // Função para atualizar as filas de agendamento
  atualizarCards(){

    const hojeFormatado = this.formatarDataLocal(
      new Date()
    );

    this.followsHoje = this.follows.filter(
      follow =>
        follow.data === hojeFormatado &&
        follow.status === 'Em follow'
    );

    this.followsAtrasados = this.follows.filter(
      follow =>
        follow.data < hojeFormatado &&
        follow.status === 'Não realizou o follow'
    );
  }

  // Função expandir o card selecionado
  abrirModal(follow: FollowsModel) {
    this.followSelecionado = follow;
    this.modalAberto = true;
  }

  // Função para fechar modal
  fecharModal(){
    this.modalAberto = false;
  }

  // Função para reagendar o follow
  abrirReagendamento(){
    this.acaoSelecionada = 'reagendar';
  }

  // Função para finalizar follow
  abrirEncerramento(){
    this.acaoSelecionada = 'finalizar';
  }

  // Função para reagendar follow
  confirmaReagendamento(){
    if (!this.followSelecionado) return;
    this.followSelecionado.data = this.novaData;

    this.atualizarCards();
    this.modalAberto = false;
  }

  confirmaEncerramento() {

    if(this.followSelecionado){

      this.followSelecionado.status = this.statusEncerramento;

      this.atualizarCards();

      this.fecharModal();
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
}
