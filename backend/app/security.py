from datetime import datetime, timedelta
import jwt
import bcrypt

SECRET_KEY = "brentwood_mvb_2026_christopherAFSilva"
ALGORITHM = "HS256"

# GERAR HASH
def gerar_hash(senha: str):

    senha_bytes = senha.encode('utf-8')

    salt = bcrypt.gensalt()

    senha_hash = bcrypt.hashpw(
        senha_bytes,
        salt
    )

    return senha_hash.decode('utf-8')


# VERIFICAR SENHA
def verificar_senha(
    senha: str,
    senha_hash: str
):

    return bcrypt.checkpw(
        senha.encode('utf-8'),
        senha_hash.encode('utf-8')
    )


# GERAR TOKEN
def criar_token(dados: dict):

    dados_copia = dados.copy()

    expiracao = datetime.utcnow() + timedelta(hours=8)

    dados_copia.update({
        "exp": expiracao
    })

    token = jwt.encode(
        dados_copia,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token

def filtro_permissao(
    query,
    usuario,
    campo_loja,
    campo_vendedor
):

    if usuario["perfil"] in ["admin", "diretoria"]:
        return query

    elif usuario["perfil"] == "gerente":
        return query.filter(
            campo_loja == usuario["loja"]
        )

    return query.filter(
        campo_vendedor == usuario["id"]
    )