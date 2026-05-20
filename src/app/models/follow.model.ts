// Modelo para envio das informações de agendamentons/Follows

export interface FollowsModel {

    id: number;

    cliente: string;

    arquiteto: string;

    telefone: string;

    email: string;

    vendedor: string;

    lojaId: string;

    data: string;

    hora: string;

    observacoes?: string;

    estagio:
        'Sem necessidade de ajuste' |
        'Ajuste de proposta'|
        'Contornando objeções'|
        'Aguardando decisão'|
        'Momento de entender a preferencia'|
        'Em negociação'|
        'Negociação final'|
        'Fechamento';
    
    status:
        'Em follow'|
        'Não realizou o follow'|
        'Encerrado Brentwood'|
        'Encerrado concorrência'|
        'Desistiu da compra';
}