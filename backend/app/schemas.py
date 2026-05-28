from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date, time

# Modelo padrão de inforamções que alimentará a tabela 'Users'
class UsuarioCreate(BaseModel):

    nome: str
    email: str
    senha_hash: str
    loja: str
    perfil: str

# Modelo padrão de inforamções que alimentará a tabela 'Services_Records'
class AtendimentoCreate(BaseModel):

    vendedor_id: int
    loja: str
    score: int
    ranking: str
    orcamento: Optional[str] = None
    concorrentes: Optional[str] = None
    gerou_follow: str
    data_follow: Optional[datetime] = None
    respostas: dict

# Modelo padrão de agendamento
class AgendamentoBase(BaseModel):
    
    cliente: str
    telefone: str
    email: str
    loja_id: str
    vendedor_id: int
    orcamento: Optional[str] = None
    arquiteto: str
    produto: str
    data_agendamento: date
    hora_agendamento: time
    estagio: str
    prioridade: str
    observacoes: str
    status: str
    atendimento_id: int
    follow_parent_id: Optional[int] = None
    estrategia: Optional[str] = None
    obs_follow: Optional[str] = None
    prazo_final: Optional[date] = None
    possibilidade: Optional[str] = None
    forma_contato: str

class AgendamentoCreate(AgendamentoBase):
    pass

class AgendamentoResponse(AgendamentoBase):
    id: int
    class Config:
        from_attributes = True