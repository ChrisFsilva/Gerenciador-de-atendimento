from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY  = 'brentwood_mvb_2026_christopherAFSilva'
ALGORITHM = 'HS256'
ACESS_TOKEN_EXPIRE_MINUTES = 480

pwd_context = CryptContext(
    schemes=["bcrypt"]
    deprecated="auto"
)

# HASH DE SENHA
def gerar_hash(senha: str):
    return pwd_context.hash(senha)

# VALIDADOR DA SENHA
def verificar_senha(
        senha: str,
        senha_hash: str
):
    return pwd_context.verify(
        senha,
        senha_hash: str
    )

# GERAR TOKEN
def criar_token(data: dict):
    dados = data.copy()

    expiracao = datetime.now(
        timezone.utc) + timedelta(
            minutes=ACESS_TOKEN_EXPIRE_MINUTES
        )
    
    dados.update({"exp": expiracao})

    return jwt.enconde(
        dados,
        SECRET_KEY,
        algorithm=ALGORITHM
    )