// Modelo padrão para envio das informações de "Registrar atendimento       "

export interface AtendimentoModel {

  id: number;

  vendedorId: number;

  cliente: string;

  dataAtendimento: Date;

  situação: string;

}