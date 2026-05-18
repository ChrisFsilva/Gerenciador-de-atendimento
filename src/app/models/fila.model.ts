// Modelo da criação da fila

export interface FilaModel {

  id: number;

  usuarioId: number;

  lojaId: number;

  posicao: number;

  ativo: boolean;

  dataEntrada: Date;

}