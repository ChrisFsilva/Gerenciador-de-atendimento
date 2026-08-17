export interface AtualizacaoLoteResponse {
    mensagem: string;
    quantidade: number;
}

export interface FollowsModel {

        id: number;
        date_agenda: string;
        estagio: string | null;
        status: string | null;
        prioridade: string | null;
        situation: string | null;
        contact_form: string;
        final_date: string | null;
        follow_parent_id: number | null;
        
        erp_order_id: string;
        valor: number;

        erp_profissional_id: number | null;
        profissional_name: string | null;
        profissional_mail: string | null;

        erp_client_id: number;
        client_name: string | null;
        telefone: string | null;
        email: string | null
}
