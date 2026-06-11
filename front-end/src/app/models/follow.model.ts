export interface AtualizacaoLoteResponse {
    mensagem: string;
    quantidade: number;
}

export interface FollowsModel {

    id: number;

    atendimento_id: number;

    cliente: string;

    telefone: string;

    email: string;

    loja_id: string;

    vendedor_id: number;

    arquiteto: string;

    produto: string;

    data_agendamento: string;

    hora_agendamento: string;

    prioridade: string;

    observacoes:  string;

    follow_parent_id?: number;

    prazo_final: string;
    
    estrategia?: string;

    obs_follow?: string;

    possibilidade?: string;

    orcamento?: string;

    forma_contato: string;

    estagio: string;
    // estagio:
    //     'Sem necessidade de ajuste' |
    //     'Ajuste de proposta'|
    //     'Contornando objeções'|
    //     'Aguardando decisão'|
    //     'Momento de entender a preferencia'|
    //     'Em negociação'|
    //     'Negociação final'|
    //     'Fechamento';
    
    status: string;
    // status:
    //     'Em follow'|
    //     'Não realizou o follow'|
    //     'Encerrado Brentwood'|
    //     'Encerrado concorrência'|
    //     'Reagendado' |
    //     'Desistiu da compra';
}
