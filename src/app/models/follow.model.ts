// Modelo para envio das informações de agendamentons/Follows

export interface FollowsModel {

    id: number;

    cliente: string;

    telefone: string;

    email: string;

    vendedorId: number;

    lojaId: number;

    dataAgendamento: Date;

    observacoes?: string;

    status: 'agendado' | 'concluido' | 'cancelado';

}