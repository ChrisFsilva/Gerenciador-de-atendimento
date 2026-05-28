from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, SessionLocal
from app.models import (
    Base,
    Usuario,
    Atendimento,
    AnswerRecord,
    Agendamento
)

from app.schemas import (
    UsuarioCreate,
    AgendamentoResponse
)

from app import schemas, models

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
# CRIAR USUÁRIO
# =========================
@app.post("/usuarios")
def criar_usuario(usuario: UsuarioCreate):

    db: Session = SessionLocal()

    novo_usuario = Usuario(

        nome = usuario.nome,

        email = usuario.email,

        senha_hash = usuario.senha_hash,

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
# LISTAR FOLLOWS
# =========================
@app.get(
    "/follows",
    response_model = list[AgendamentoResponse]
)
def listar_agendamentos(
    db: Session = Depends(get_db)
):

    agendamentos = db.query(
        Agendamento
    ).all()

    return agendamentos

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
# CRIAR FOLLOW
# =========================
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
# CRIAR ATENDIMENTO
# =========================
@app.post("/atendimentos")
def criar_atendimento(
    atendimento: schemas.AtendimentoCreate,
    db: Session = Depends(get_db)
):

    # =========================
    # REGISTRO PRINCIPAL
    # =========================
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