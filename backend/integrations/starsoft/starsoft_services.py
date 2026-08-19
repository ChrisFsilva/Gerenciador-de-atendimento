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