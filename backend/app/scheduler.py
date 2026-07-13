from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, timezone

from app.database import SessionLocal
from app.models import FilaAtendimento

scheduler = BackgroundScheduler()


def remover_usuarios_inativos():

    db = SessionLocal()

    try:
        agora = datetime.now()

        usuarios = (
            db.query(FilaAtendimento)
            .filter(
                FilaAtendimento.ativo == True,
            )
            .all()
        )


        for usuario in usuarios:
            limite = agora + timedelta(minutes=10)

            remover = agora > limite

            print(f"Removendo usuário -- {usuario.usuario_id}")
            print(
            "Usuário:", usuario.usuario_id,
            "login", usuario.data_entrada,
            "Última atividade:", usuario.ultima_atividade,
            "Limite:", limite,
            "Remover?", usuario.ultima_atividade > limite
            )
            if remover:
                print(f"Removendo usuário -- {usuario.usuario_id}")
                usuario.ativo = False

        db.commit()

    finally:
        db.close()


scheduler.add_job(
    remover_usuarios_inativos,
    "interval",
    seconds=10
)