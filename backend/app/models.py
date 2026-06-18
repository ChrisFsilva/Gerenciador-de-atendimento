from sqlalchemy import Column, Integer, String, ForeignKey, Boolean,DateTime, Date, Time
from datetime import datetime, timezone
from sqlalchemy.orm import relationship

from app.database import Base

# Classe que se comunicará com o banco de dados na tabela 'Users'
class Usuario(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nome = Column(String(255))

    email = Column(
        String(255),
        unique=True
    )

    senha_hash = Column(String(255))

    loja = Column(String(255))

    perfil = Column(String(50))

    ativo = Column(
        Boolean,
        default=True
    )

    ultimo_login = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    atendimentos = relationship(
        "Atendimento",
        back_populates="vendedor"
    )

# Classe que se comunicará com o banco de dados da tabela 'services_records'
class Atendimento(Base):

    __tablename__ = "services_records"

    id = Column(Integer, primary_key=True)

    vendedor_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    loja = Column(String(255))

    score = Column(Integer)

    ranking = Column(String(50))

    orcamento = Column(String(255))

    concorrentes = Column(String(255))

    gerou_follow = Column(String(255))

    data_follow = Column(DateTime)

    vendedor = relationship(
        "Usuario",
        back_populates="atendimentos"
    )
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )


# Classe que se comunicará com o banco de dados, na tabela Anwser_records

class AnswerRecord(Base):

    __tablename__ = "answer_records"

    id = Column(Integer, primary_key=True, index=True)

    atendimento_id = Column(
        Integer,
        ForeignKey("services_records.id")
    )

    pergunta_id = Column(Integer)

    resposta = Column(String(255))

# Classe para coletar agendamentos do banco
class Agendamento(Base):

    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True)

    cliente = Column(String(150), nullable=False)

    telefone = Column(String(30))

    email = Column(String(150))

    loja_id = Column(String(20), nullable=False)

    vendedor_id = Column(Integer, ForeignKey("users.id"))

    orcamento = Column(String(255))

    arquiteto = Column(String(150))

    produto = Column(String(100))

    data_agendamento = Column(Date)

    hora_agendamento = Column(Time)

    estagio = Column(String(100))

    prioridade = Column(String(20))

    observacoes = Column(String(150))

    status = Column(String(50))

    atendimento_id = Column(Integer, ForeignKey("services_records.id"))
    
    follow_parent_id = Column(
        Integer,
        ForeignKey("follows.id"),
        nullable=True
    )
    
    criado_em = Column(DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    estrategia = Column(String)
    
    obs_follow = Column(String)
    
    prazo_final = Column(Date)

    possibilidade = Column(String)
    
    forma_contato = Column(String)

class FilaAtendimento(Base):
    __tablename__ = "fila_atendimento"

    id = Column(
        Integer,
        primary_key = True
    )

    usuario_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    loja =  Column(
        String(50)
    )

    data_entrada = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    ativo = Column(
        Boolean, 
        default=True
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    usuario = relationship(
        "Usuario"
    )