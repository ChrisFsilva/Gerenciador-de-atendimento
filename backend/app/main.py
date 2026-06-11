from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
from jose import jwt


from app.security import SECRET_KEY, ALGORITHM
from app.database import engine, SessionLocal
from app.models import (
    Base,
    Usuario,
    Atendimento,
    AnswerRecord,
    Agendamento
)
from app.schemas import (AtualizacaoLoteRequest)

from app.schemas import (
    UsuarioCreate,
    AgendamentoResponse,
    AtualizacaoLoteResponse
)

from datetime import datetime, timedelta

from app import schemas, models

from app.security import (gerar_hash,verificar_senha,criar_token)

# =========================
# CRIAR TABELAS
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# INSTÂNCIA API
# =========================
app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200"
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

# CRIAR USUÁRIO NOVO
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

# AUTENTICAÇÃO DE LOGIN 
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
security = HTTPBearer()
def obter_usuario(
        credenciais: HTTPAuthorizationCredentials = Depends(security)
    ):
    
    print("TOKEN RECEBIDO:", credenciais.credentials)
    print("SCHEME:", credenciais.scheme)
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
        print("ERRO JWT:", e)
        raise HTTPException(
            status_code=401,
            detail="Token Inválido",
        )

# LISTAR FOLLOWS
@app.get(
    "/follows",
    response_model = list[AgendamentoResponse]
)
def listar_agendamentos(
    usuario = Depends(obter_usuario),
    db: Session = Depends(get_db)
):
    print("MONTANDO JSON")

    if usuario["perfil"] in ["admin", "diretoria"]:
        print("Perfil:",usuario["perfil"],"ID:",usuario["id"],"LOJA:",usuario["loja"])
        agendamentos = db.query(
            Agendamento).all()
    
    elif usuario["perfil"] == "gerente":
        print("Perfil: ",usuario["perfil"],"ID:",usuario["id"],"LOJA:",usuario["loja"])
        agendamentos = db.query(
            models.Agendamento
        ).filter(
            models.Agendamento.loja_id == usuario["loja"]
            ).all()
    
    else:
        print("Perfil:",usuario["perfil"],"ID:",usuario["id"],"LOJA:",usuario["loja"])
        agendamentos = db.query(
            models.Agendamento
                ).filter(
                    models.Agendamento.vendedor_id == usuario["id"]
                ).all()
        
    return agendamentos


# OBTER ATENDIMENTO
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

# CRIAR FOLLOW
@app.post("/follows")
def criar_follow(
    follow: schemas.AgendamentoCreate,
    db: Session = Depends(get_db)
):

    novo_follow = models.Agendamento(

        cliente = follow.cliente,

        telefone = follow.telefone,

        email = follow.email,

        loja_id = follow.loja_id,

        vendedor_id = follow.vendedor_id,

        arquiteto = follow.arquiteto,

        produto = follow.produto,

        data_agendamento = follow.data_agendamento,

        hora_agendamento = follow.hora_agendamento,

        estagio = follow.estagio,

        prioridade = follow.prioridade,

        observacoes = follow.observacoes,

        obs_follow = follow.obs_follow,

        estrategia = follow.estrategia,

        prazo_final = follow.prazo_final,

        possibilidade = follow.possibilidade,

        status = follow.status,

        atendimento_id = follow.atendimento_id,

        follow_parent_id = follow.follow_parent_id,

        forma_contato = follow.forma_contato
    )

    db.add(novo_follow)

    db.commit()

    db.refresh(novo_follow)

    return novo_follow


# =========================
# CRIAR ATENDIMENTO
# =========================
@app.post("/atendimentos")
def criar_atendimento(
    atendimento: schemas.AtendimentoCreate,
    db: Session = Depends(get_db)
):

    # REGISTRO NA TABELA SERVICES_RECORDS
    novo_atendimento = models.Atendimento(

        vendedor_id = atendimento.vendedor_id,

        loja = atendimento.loja,

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

    # =========================
    # SALVAR RESPOSTAS
    # =========================
    for pergunta_id, resposta in atendimento.respostas.items():

        nova_resposta = models.AnswerRecord(

            atendimento_id = novo_atendimento.id,

            pergunta_id = int(pergunta_id),

            resposta = str(resposta)
        )

        db.add(nova_resposta)

    db.commit()

    return novo_atendimento

# Cards diarios
@app.get("/dashboard/cards")
def dashboard_cards(
    db: Session = Depends(get_db)
):

    hoje = datetime.now().date()

    inicio_mes = hoje.replace(day=1)

    ultimos_15_dias = hoje - timedelta(days=15)

    follows = db.query(
        Agendamento
    ).all()

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

# Graficos de rendimento mês
@app.get("/dashboard/follows-mensais")
def follows_mensais(
    db: Session = Depends(get_db)
):

    atendimentos = db.query(
        Atendimento
    ).all()

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

# Cards de atendimento e produtividade
@app.get("/dashboard/atendimentos")
def dashboard_atendimentos(
    db: Session = Depends(get_db)
):

    atendimentos = db.query(
        Atendimento
    ).all()

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

# Tabela Gantt
@app.get("/dashboard/gantt")
def dashboard_gantt(
    db: Session = Depends(get_db)
):

    follows = db.query(
        Agendamento
    ).all()

    vendedores = {}

    for follow in follows:

        vendedor = db.query(
            Usuario
        ).filter(
            Usuario.id == follow.vendedor_id
        ).first()

        if not vendedor:
            continue

        if vendedor.nome not in vendedores:

            vendedores[vendedor.nome] = {
                "vendedor": vendedor.nome,
                "clientes": {}
            }

        cliente = follow.cliente

        if cliente not in vendedores[vendedor.nome]["clientes"]:

            vendedores[vendedor.nome]["clientes"][cliente] = []

        vendedores[vendedor.nome]["clientes"][cliente].append({

            "id": follow.id,

            "data_agendamento": follow.data_agendamento,

            "prazo_final": follow.prazo_final,

            "status": follow.status,

            "estagio": follow.estagio

        })

    return list(vendedores.values())

# Registro de follow atrasado
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
    print("ENTROU NO PUT")

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
