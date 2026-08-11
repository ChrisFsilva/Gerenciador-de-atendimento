from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date, time
from typing import List


# Modelo padrão de inforamções que alimentará a tabela 'Users'
class UsuarioCreate(BaseModel):

    nome: str
    email: str
    senha: str
    loja: str
    perfil: str

# Modelo padrão de inforamções que alimentará a tabela 'Services_Records'
class AtendimentoCreate(BaseModel):

    # vendedor_id: int
    # loja: str
    score: int
    ranking: int
    orcamento: Optional[str] = None
    concorrentes: Optional[str] = 'Não mencionado'
    gerou_follow: str
    data_follow: Optional[datetime] = None
    respostas: dict

# Modelo padrão de agendamento
class AgendamentoBase(BaseModel):
    
    Date_Agenda: datetime
    Estagio: str
    Status: str
    Prioridade: str
    Situation: str
    Contact_Form: str
    Final_Date: datetime
    
class AtendimentoRequest(BaseModel):
    atendimento: AtendimentoCreate
    follow: AgendamentoBase

class AgendamentoCreate(AgendamentoBase):
    pass

class AgendamentoResponse(AgendamentoBase):
    id: int
    class Config:
        from_attributes = True

# SISTEMA DE LOGIN
class LoginRequest(BaseModel):
    email: str
    senha: str

class AtualizacaoLoteRequest(BaseModel):
    follow_ids: List[int]
    status: str

class AtualizacaoLoteResponse(BaseModel):
    mensagem: str
    quantidade: int

class UpdatePendenciaCreate(BaseModel):
    cliente: str
    status: str

class OrcamentoFuturoCreate(BaseModel):

    cliente: str
    telefone: Optional[str] = None
    email: Optional[str] = None
    forma_contato: Optional[str] = None
    data_contato: Optional[datetime] = None

class UpdateFuturo(BaseModel):
    
    cliente: str
    telefone: Optional[str] = None
    email: Optional[str] = None
    forma_contato: Optional[str] = None
    data_contato: Optional[datetime] = None
    data_criacao: datetime

class FinalizarAtendimentoRequest(BaseModel):
    atendimento: AtendimentoCreate
    agendamento: AgendamentoCreate