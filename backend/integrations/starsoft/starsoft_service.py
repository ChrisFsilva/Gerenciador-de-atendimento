from app import models

def salvar_cliente(db, dados_starsoft):
    cliente = (
        db.query(models.AddClient)
        .filter(
            models.AddClient.ERP_Client_ID == dados_starsoft["codigo_cliente"]
        )
        .first()
    )

    if cliente:
        cliente.Name = dados_starsoft["nome_cliente"]
        cliente.Phone = dados_starsoft["telefone_cliente"]
        cliente.Email = dados_starsoft["email_cliente"]
    
    else:
        cliente = models.AddClient(
            ERP_Client_ID = dados_starsoft["codigo_cliente"],
            Name = dados_starsoft["nome_cliente"],
            Phone = dados_starsoft["telefone_cliente"],
            Email = dados_starsoft["email_cliente"]
        )

        db.add(cliente)
    
    db.commit()
    db.refresh(cliente)

    return cliente
    
def salvar_order(db,
                dados_starsoft,
                cliente,
                vendedor_id):
    orcamento = (
        db.query(models.AddOrder)
        .filter(
            models.AddOrder.ERP_Order_ID == dados_starsoft["orcamento"]
        )
        .first()
    )

    if orcamento:
        orcamento.Valor = dados_starsoft["valor_bruto_orcamento"]
        orcamento.Client_ID = cliente.id
    
    else:
        orcamento = models.AddOrder(
            ERP_Order_ID= dados_starsoft["orcamento"],
            Client_ID = cliente.id,
            Vendor_ID = vendedor_id,
            Valor = dados_starsoft["valor_bruto_orcamento"]
        )

        db.add(orcamento)
    
    db.commit()
    db.refresh(orcamento)

    return orcamento

def salvar_profissional(db,
                    dados_starsoft):
    profissional = (
        db.query(models.AddProfissional)
        .filter(
            models.AddProfissional.ERP_Profissional_ID == dados_starsoft["codigo_profissional"]
        )
        .first()
    )

    if profissional:
        profissional.Profissional_Mail = dados_starsoft["email_profissional"]
    
    else:
        profissional = models.AddProfissional(
            ERP_Profissional_ID = dados_starsoft["codigo_profissional"],
            Profissional_Name = dados_starsoft["nome_profissional"],
            Profissional_Doc = dados_starsoft["cpf_cnpj_profissional"],
            Profissional_Mail = dados_starsoft["email_profissional"],
        )

        db.add(profissional)
    
    db.commit()
    db.refresh(profissional)

    return profissional

def salvar_follow(
    db,
    agendamento,
    cliente,
    orcamento,
    profissional,
    vendedor_id
):
    follow = models.NewFollow(

        Client_ID = cliente.id,

        Order_ID = orcamento.id,

        Profissional_ID = profissional.id,

        Vendor_ID = vendedor_id,

        Date_Agenda = agendamento.data_agendamento,

        Final_Date = agendamento.prazo_final,

        Contact_For = agendamento.forma_contato,

        Estagio = "Novo",

        Status = "Ativo",

        Prioridade = "Normal",

        Situation = "Em andamento",

        Follow_Parent_ID = None
    )

    db.add(follow)
    db.commit()
    db.refresh(follow)

    return follow