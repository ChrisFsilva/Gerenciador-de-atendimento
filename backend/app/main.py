from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
from jose import jwt
from app.scheduler import scheduler

from integrations.starsoft.starsoft_automation import enviar_orcamento
from integrations.teams.agend_teams import enviar_agendamento
from integrations.starsoft.starsoft_service import salvar_cliente, salvar_order, salvar_profissional, salvar_follow

from app.security import (SECRET_KEY, 
                          ALGORITHM,
                          filtro_permissao)
from app.database import engine, SessionLocal
from app.models import (
    Base,
    Usuario,
    Atendimento,
    AnswerRecord,
    Agendamento,
    FilaAtendimento,
    UpdatePendencia,
    OrcamentoFuturo,
)

from app.schemas import (AtualizacaoLoteRequest)

from app.schemas import (
    UsuarioCreate,
    AgendamentoResponse,
    AtualizacaoLoteResponse,
    UpdatePendenciaCreate
)

from datetime import datetime, timedelta, time

from app import schemas, models

from app.security import (gerar_hash,verificar_senha,criar_token)

from app.heartbeat_state import heartbeats_locais

# =========================
# CRIAR TABELAS
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# INSTÂNCIA API
# =========================
app = FastAPI(
  root_path="/api"
  )
scheduler.start()
# =========================
# CORS
# =========================
app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://127.0.0.1:8000",
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://192.168.0.129",
        "http://developer-fila.brentwood.com.br",
        "http://localhost:4200"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

# =========================
# DATABASE SESSION
# =========================
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

# =========================
# ROTA INICIAL
# =========================
@app.get("/")
def home():

    return {
        "mensagem": "API funcionando"
    }

# =========================
# ENDPOINT PARA TRABALHAR COM USUARIOS
# =========================

# =========================
# CRIAR USUÁRIO NOVO
# =========================
@app.post("/novousuarios")
def criar_usuario(usuario: UsuarioCreate):

    db: Session = SessionLocal()

    novo_usuario = Usuario(

        nome = usuario.nome,

        email = usuario.email,

        senha_hash = gerar_hash(usuario.senha),

        loja = usuario.loja,

        perfil = usuario.perfil
    )

    db.add(novo_usuario)

    db.commit()

    db.refresh(novo_usuario)

    return {

        "mensagem": "Usuário criado",

        "id": novo_usuario.id
    }

# =========================
# AUTENTICAÇÃO DE LOGIN 
# =========================
@app.post("/login")
def login(
    dados: schemas.LoginRequest,
    db: Session = Depends(get_db)
    ):

    usuario = db.query(
        models.Usuario
    ).filter(
        models.Usuario.email == dados.email
    ).first()

    if not usuario:

        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha inválidos"
        )
    
    senha_valida = verificar_senha(
        dados.senha,
        usuario.senha_hash
    )

    if not senha_valida:

        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha inválidos"
        )

    token = criar_token({

        "sub": usuario.email,
        "id": usuario.id,
        "perfil": usuario.perfil,
        "nome": usuario.nome,
        "loja": usuario.loja
    })

    return {

        "access_token": token,
        "token_type": "bearer",
        "usuario": {

            "id": usuario.id,
            "nome": usuario.nome,
            "perfil": usuario.perfil,
            "loja": usuario.loja
        }
    }

# =========================
# RECEBER INFORMAÇÕES DOS USUARIOS
# =========================
security = HTTPBearer()
def obter_usuario(
        credenciais: HTTPAuthorizationCredentials = Depends(security)
    ):
    
    token = credenciais.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms = [ALGORITHM]
        )

        return {
            "id": payload["id"],
            "nome": payload["nome"],
            "perfil": payload["perfil"],
            "email": payload["sub"],
            "loja": payload["loja"]
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Token Inválido",
        )

# =========================
# ENDPOINT PARA OS FOLLOWS
# =========================

# =========================
# LISTAR FOLLOWS
# =========================
@app.get(
    "/follows",
    response_model = list[AgendamentoResponse]
)
def listar_agendamentos(

    db: Session = Depends(get_db)
):

    query = db.query(
        models.NewFollow,
        models.AddClient,
        models.AddOrder,
        models.AddProfissional,
        models.Usuario
    ).join(
        models.AddClient,
        models.NewFollow.Client_ID == models.AddClient.id
    ).join(
        models.AddOrder,
        models.NewFollow.Order_ID == models.AddOrder.id
    ).join(
        models.AddProfissional,
        models.NewFollow.Profissional_ID == models.AddProfissional.id
    ).join(
        models.Usuario,
        models.NewFollow.Vendor_ID == models.Usuario.id
    )

    resultado = query.all()
    respostas = []

    for follow, client, order, profissional, vendedor in resultado:

        respostas.append(
            AgendamentoResponse(
                id = follow.id,

                erp_client_id = client.ERP_Client_ID,
                client_name = client.Name,
                telefone = client.Phone,
                email = client.Email,

                erp_order_id = order.ERP_Order_ID,
                valor = order.Valor,

                vendedor_id = vendedor.id,

                erp_profissional_id = profissional.ERP_Profissional_ID,
                profissional_name = profissional.Profissional_Name,
                profissional_mail = profissional.Profissional_Mail,

                date_agenda = follow.Date_Agenda,
                final_date = follow.Final_Date,

                situation = follow.Situation,
                estagio = follow.Estagio,
                status = follow.Status,
                prioridade = follow.Prioridade,
                contact_form = follow.Contact_Form,
                follow_parent_id = follow.Follow_Parent_ID
            )
        )
    return respostas

# =========================
# OBTER ATENDIMENTO
# =========================
@app.get("/atendimento/{atendimento_id}")
def obter_atendimento(
    atendimento_id: int,
    db: Session = Depends(get_db)
):

    atendimento = db.query(
        models.Atendimento
    ).filter(
        models.Atendimento.id == atendimento_id
    ).first()

    return atendimento

# =========================
# CRIAR ATENDIMENTOS
# =========================
@app.post("/atendimentos")
def criar_atendimento(
    dados: schemas.AtendimentoRequest,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario)
):
    
    atendimento = dados.atendimento

    follow = dados.follow

    dados_starsoft = enviar_orcamento(
        atendimento.orcamento
    )
    
    cliente = salvar_cliente(
        db,
        dados_starsoft
    )

    orcamento = salvar_order(
        db,
        dados_starsoft,
        cliente,
        usuario_logado["id"]
    )

    profissional = salvar_profissional(
        db,
        dados_starsoft
    )

    new_follow = models.NewFollow(

        Client_ID = cliente.id,

        Order_ID = orcamento.id, 

        Profissional_ID = profissional.id,

        Vendor_ID = usuario_logado["id"],

        Date_Agenda = follow.Date_Agenda,

        Estagio = follow.Estagio,

        Status = follow.Status,

        Prioridade = follow.Prioridade,

        Contact_Form = follow.Contact_Form,

        Final_Date = follow.Final_Date

    )

    db.add(new_follow)
    db.commit()
    db.refresh(new_follow)

    # return new_follow

    novo_atendimento = models.Atendimento(
        vendedor_id = usuario_logado["id"],
        loja = usuario_logado["loja"],
        score = atendimento.score,
        ranking = atendimento.ranking,
        orcamento = atendimento.orcamento,
        concorrentes = atendimento.concorrentes,
        gerou_follow = atendimento.gerou_follow,
        data_follow = atendimento.data_follow
    )

    db.add(novo_atendimento)
    db.commit()
    db.refresh(novo_atendimento)

    for pergunta_id, resposta in atendimento.respostas.items():
        nova_resposta = models.AnswerRecord(
            atendimento_id=novo_atendimento.id,
            pergunta_id=int(pergunta_id),
            resposta=str(resposta)
        )

        db.add(nova_resposta)

    db.commit()

    return novo_atendimento



# =========================
# CRIAR FOLLOW
# =========================
# @app.post("/follows")
# def criar_follow(
#     follow: schemas.AgendamentoCreate,
#     db: Session = Depends(get_db),
#     usuario_logado: Usuario = Depends(obter_usuario)
# ):
#     novo_follow = models.Agendamento(
#         cliente=follow.cliente,
#         telefone=follow.telefone,
#         email=follow.email,

#         loja_id=follow.loja_id,

#         vendedor_id=usuario_logado["id"],

#         arquiteto=follow.arquiteto,
#         produto=follow.produto,

#         data_agendamento=follow.data_agendamento,
#         hora_agendamento=follow.hora_agendamento,

#         estagio=follow.estagio,
#         prioridade=follow.prioridade,
#         observacoes=follow.observacoes,

#         obs_follow=follow.obs_follow,
#         estrategia=follow.estrategia,

#         prazo_final=follow.prazo_final,
#         possibilidade=follow.possibilidade,

#         status=follow.status,

#         atendimento_id=follow.atendimento_id,
#         follow_parent_id=follow.follow_parent_id,

#         forma_contato=follow.forma_contato
#     )

#     db.add(novo_follow)
#     db.commit()
#     db.refresh(novo_follow)

#     return novo_follow

# =========================
# Registro de follow atrasado
# =========================
@app.put(
    "/follows/atualizar-lote",
    response_model=AtualizacaoLoteResponse
)
def atualizar_follow_lote(
    dados: AtualizacaoLoteRequest,
    db: Session = Depends(get_db)
):
    quantidade = (
        db.query(Agendamento)
        .filter(
            Agendamento.id.in_(dados.follow_ids)
        )
        .update(
            {"status": dados.status},
            synchronize_session=False
        )
    )

    db.commit()

    return {
        "mensagem": f"{quantidade} follows foram modificados para atrasado",
        "quantidade": quantidade
    }

# =========================
# ATUALIZAR FOLLOW
# =========================
@app.put("/follows/{id}")
def atualizar_follow(
    id: int,
    dados: dict,
    db: Session = Depends(get_db)
):

    follow = db.query(
        models.Agendamento
    ).filter(
        models.Agendamento.id == id
    ).first()

    if not follow:

        return {
            "erro": "Follow não encontrado"
        }

    for chave, valor in dados.items():

        setattr(
            follow,
            chave,
            valor
        )

    db.commit()

    db.refresh(follow)

    return follow

# =========================
# DASHBOARDS
# =========================

# Cards diarios
@app.get("/dashboard/cards")
def dashboard_cards(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario)  
):
    query = db.query(Agendamento)

    query = filtro_permissao(
        query,
        usuario_logado,
        Agendamento.loja_id,
        Agendamento.vendedor_id
    )

    hoje = datetime.now().date()

    inicio_mes = hoje.replace(day=1)

    ultimos_15_dias = hoje - timedelta(days=15)

    follows = query.all()
    follows_hoje = 0
    follows_15_dias = 0
    follows_mes = 0

    for follow in follows:

        if not follow.data_agendamento:
            continue

        data = follow.data_agendamento

        if data == hoje:
            follows_hoje += 1

        if data >= ultimos_15_dias:
            follows_15_dias += 1

        if data >= inicio_mes:
            follows_mes += 1

    return {

        "hoje": follows_hoje,

        "ultimos15dias": follows_15_dias,

        "mes": follows_mes
    }

# =========================
# Graficos de rendimento mês
# =========================
@app.get("/dashboard/follows-mensais")
def follows_mensais(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario)  
):
    atendimentos = db.query(Atendimento)

    atendimentos = filtro_permissao(
        atendimentos,
        usuario_logado,
        Atendimento.loja,
        Atendimento.vendedor_id
    )

    meses = [
        "Jan", "Fev", "Mar", "Abr",
        "Mai", "Jun", "Jul", "Ago",
        "Set", "Out", "Nov", "Dez"
    ]

    valores = [0] * 12

    for atendimento in atendimentos:

        if atendimento.data_follow:

            mes = atendimento.data_follow.month

            valores[mes - 1] += 1

    return {
        "meses": meses,
        "valores": valores
    }

# =========================
# Cards de atendimento e produtividade
# =========================
@app.get("/dashboard/atendimentos")
def dashboard_atendimentos(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario)  
):
    query = db.query(Atendimento)

    query = filtro_permissao(
        query,
        usuario_logado,
        Atendimento.loja,
        Atendimento.vendedor_id
    )
    
    atendimentos = query.all()

    total_atendimentos = len(atendimentos)

    total_orcamentos = 0

    hoje = datetime.now().date()

    atendimentos_hoje = 0

    atendimentos_mes = 0

    for atendimento in atendimentos:

        # orçamento
        if (
            atendimento.orcamento
            and atendimento.orcamento.strip() != ""
        ):
            total_orcamentos += 1

        # atendimentos hoje
        if atendimento.created_at:

            if atendimento.created_at.date() == hoje:
                atendimentos_hoje += 1

            if (
                atendimento.created_at.month == hoje.month
                and atendimento.created_at.year == hoje.year
            ):
                atendimentos_mes += 1

    percentual = 0

    if total_atendimentos > 0:

        percentual = round(
            (total_orcamentos / total_atendimentos) * 100,
            1
        )

    return {

        "atendimentos": total_atendimentos,

        "orcamentos": total_orcamentos,

        "percentual": percentual,

        "atendimentos_hoje": atendimentos_hoje,

        "atendimentos_mes": atendimentos_mes

    }
# =========================
# Tabela Gantt
# =========================
@app.get("/dashboard/gantt")
def dashboard_gantt(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(obter_usuario)
):
    query = (
        db.query(
            Agendamento,
            Usuario
        )
        .join(
            Usuario,
            Usuario.id == Agendamento.vendedor_id
        )
    )

    query = filtro_permissao(
        query,
        usuario_logado,
        Agendamento.loja_id,
        Agendamento.vendedor_id
    )
    resultados = query.all()
    vendedores = {}

    for follow, vendedor in resultados:
        if vendedor.nome not in vendedores:
            vendedores[vendedor.nome] = {
                "vendedor": vendedor.nome,
                "clientes": {}
            }
        cliente = follow.cliente

        if cliente not in vendedores[vendedor.nome]["clientes"]:
            vendedores[vendedor.nome]["clientes"][cliente] = []
        vendedores[vendedor.nome]["clientes"][cliente].append({
        "id":follow.id,
        "data_agendamento": follow.data_agendamento,
        "prazo_final": follow.prazo_final,
        "status": follow.status,
        "estagio": follow.estagio
        })

    return list(vendedores.values())


# =========================
# ENDPOINT PARA ATUAÇÃO NAS FILAS
# =========================

# =========================
# ENTRAR NA FILA
# =========================
@app.post("/fila/entrar")
def entrar_fila(
    db: Session  = Depends (get_db),
    usuario_logado = Depends(obter_usuario)
):
    fila_existente = db.query(
        FilaAtendimento
    ).filter(
        FilaAtendimento.usuario_id == usuario_logado["id"],
        FilaAtendimento.ativo == True
    ).first()

    if fila_existente:
        raise HTTPException(
            status_code=400,
            detail="Usuário já está na fila"
        )
    
    novo_registro = FilaAtendimento(
        usuario_id  = usuario_logado["id"],
        loja = usuario_logado["loja"],
        email=usuario_logado["email"],
        data_entrada = datetime.now(),
        ultima_atividade = datetime.now(),
        ativo = True
    )

    db.add(novo_registro)
    db.commit()
    db.refresh(novo_registro)

    return {
        "mensagem":"Entrou na fila com sucesso"
    }

# =========================
# RECEBER POSIÇÃO NA FILA
# =========================
@app.get("/fila/minha-posicao")
def minha_posicao(
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)
):
    registro = db.query(
        FilaAtendimento
    ).filter(
        FilaAtendimento.usuario_id == usuario_logado ["id"],
        FilaAtendimento.ativo == True
    ).first()

    if not registro:
        raise HTTPException(
            status_code=404,
            detail="Usuário não está na fila"
        )
    pessoas_antes = db.query(
        FilaAtendimento
    ).filter(
        FilaAtendimento.loja == usuario_logado["loja"],
        FilaAtendimento.ativo == True,
        FilaAtendimento.data_entrada < registro.data_entrada
    ).count()

    return{
        "posicao": pessoas_antes + 1
    }

# =========================
# SAIR DA FILA
# =========================
@app.post("/fila/sair")
def sair_fila(
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)
):
    registro = db.query(
        FilaAtendimento
    ).filter(
        FilaAtendimento.usuario_id == usuario_logado["id"],
        FilaAtendimento.ativo == True
    ).first()

    if not registro:
        {
            "mensagem":"Usuário não esta na fila"
        }
        
    registro.ativo = False

    db.commit()
    return {
        "mensagem":"Saiu da fila com sucesso"
    }
# =========================
# ATIVAÇÃO DO BOTÃO LOJA CHEIA
# =========================
@app.post("/loja-cheia")
def criar_pendencia(   
    payload: UpdatePendenciaCreate,
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)
):
    nova = UpdatePendencia(
        cliente=payload.cliente,
        status=payload.status,
        vendedor_id=usuario_logado["id"],
        loja=usuario_logado["loja"]
    )

    db.add(nova)
    db.commit()
    db.refresh(nova)

    return {
        "message": "Criado com sucesso",
        "id": nova.id
    }

# =========================
# VERIFICAÇÃO SE USUARIOS AINDA ESTA ATIVO
# =========================
@app.post("/fila/heartbeat")
def heartbeat(
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)
):
    # ADICIONAR ACIONAMENTE DO HEARTBEAT EM VARIVEL LOCAL COMO DUPLO FATOR
    agora = datetime.now()
    usuario_id = usuario_logado["id"]

    heartbeats_locais[usuario_id] = agora
    
    registro = (
        db.query(FilaAtendimento)
        .filter(
            FilaAtendimento.usuario_id == usuario_logado["id"],
            FilaAtendimento.ativo == True
        )
        .first()
    )

    if registro:

        registro.ultima_atividade = datetime.now()

        db.commit()

    return {"Atualização da ultima atividade": True}

# =========================
# APRESENTAÇÃO EM LISTA DE USUARIO DA FILA
# =========================
@app.get("/fila")
def listar_fila(
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)
):

    fila = (
        db.query(FilaAtendimento, Usuario)
        .join(
            Usuario,
            Usuario.id == FilaAtendimento.usuario_id
        )
        .filter(FilaAtendimento.ativo == True,
                FilaAtendimento.loja == usuario_logado["loja"])
        .order_by(FilaAtendimento.data_entrada.asc())
        .all()
    )

    return [
        {
            "usuario_id": usuario.id,
            "nome": usuario.nome,
            "loja": atendimento.loja,
            "entrada": atendimento.data_entrada,
            "ultima_atividade": atendimento.ultima_atividade
        }
        for atendimento, usuario in fila
    ]

    # return fila
    
# =========================
# TELA DE HISTÓRICO DA FILA
# =========================
@app.get("/fila/historico")
def ultimos_dia_anterior(
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)
):
    print("Executando histórico de fila")
    ontem = datetime.now().date() - timedelta(days=1)
    inicio = datetime.combine(ontem, time.min)
    fim = datetime.combine(ontem, time.max)
    print(inicio)
    print(fim)

    historicoFila = (
        db.query(FilaAtendimento, Usuario)
        .join(Usuario,
              Usuario.id == FilaAtendimento.usuario_id)
          .filter(
                FilaAtendimento.data_entrada.between(inicio, fim),
                FilaAtendimento.loja == usuario_logado["loja"]
          )
          .order_by(FilaAtendimento.data_entrada.desc())
          .limit(7)
          .all()
    )
    return [
        {
            "usuario_id": usuario.id,
            "nome": usuario.nome,
            "loja": fila.loja,
            "entrada": fila.data_entrada,
            "ultima_atividade": fila.ultima_atividade
        }
        for fila, usuario in historicoFila

    ]
# =========================
# ENDPOINT'S DA PAGINA DE PENDENCIA
# =========================

# =========================
# COLETAR PENDENCIAS NO BANCO DE DADOS
# =========================
@app.get("/pendencias")
def listarpendencias( 
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)

):
    return(
        db.query(UpdatePendencia)
        .filter(UpdatePendencia.status == "Ativo", UpdatePendencia.vendedor_id == usuario_logado["id"])
        .all()
    )

# =========================
# INATIVAR PENDENCIAS
# =========================
@app.put("/pendencias/{id}/inativar")
def inativar_pendencia(
    id: int,
    db: Session = Depends(get_db)
):
    pendencia = (
        db.query(UpdatePendencia)
            .filter(UpdatePendencia.id == id)
            .first()
    )

    if not pendencia:
        raise HTTPException(
            status_code=404,
            detail="Pendência não encontrada"
        )
    
    pendencia.status = "Inativo"

    db.commit()

    return {"mensage":"Pendência atualizada"}


# =========================
# PAGINA DE ORÇAMENTO FUTURO
# =========================

# =========================
# CRIAR ORÇAMENTO FUTURO
# =========================
@app.post("/orcamento-futuro")
def criar_orcamento_futuro(
    payload: schemas.OrcamentoFuturoCreate,
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)
):

    novo_registro = models.OrcamentoFuturo(

        cliente = payload.cliente,

        telefone = payload.telefone,
        
        email = payload.email,

        forma_contato = payload.forma_contato,

        data_contato = payload.data_contato,

        loja_id = usuario_logado["loja"],

        vendedor_id = usuario_logado["id"],

        status = "Ativo"
    )

    enviar_agendamento(
        type = "Orçamento futuro",
        agenda_user = usuario_logado["email"],
        agend_cliente = novo_registro.cliente,
        agend_date = novo_registro.data_contato
    )

    db.add(novo_registro)

    db.commit()

    db.refresh(novo_registro)

    return novo_registro

# =========================
# CARREGAR ORÇAMENTOS FUTUROS
# =========================
@app.get("/carregar-orcamento-futuro")
def listarfuturos( 
    db: Session = Depends(get_db),
    usuario_logado = Depends(obter_usuario)

):
    return (
        db.query(OrcamentoFuturo)
            .filter(
                OrcamentoFuturo.status == "Ativo", 
                OrcamentoFuturo.vendedor_id == usuario_logado["id"])
            .all()
    )


