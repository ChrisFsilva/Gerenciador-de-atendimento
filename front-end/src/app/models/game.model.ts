export interface PerguntaModel {

  id: number;

  categoria: string;

  pergunta: string;

  tipo: 'booleano' | 'texto' | 'numero';

  pontuacaoSim?: number;

  pontuacaoNao?: number;

  proximaSeSim?: number;

  proximaSeNao?: number;

  obrigatoria: boolean;

}