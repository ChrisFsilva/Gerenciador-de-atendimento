from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, timezone

from app.database import SessionLocal
from app.models import FilaAtendimento

scheduler = BackgroundScheduler()


def remover_usuarios_inativos():

    db = SessionLocal()

    try:
        agora = datetime.now()

        limite = datetime.now()- timedelta(minutes=2)

        usuarios = (
            db.query(FilaAtendimento)
            .filter(
                FilaAtendimento.ativo == True,
                FilaAtendimento.ultima_atividade < limite
            )
            .all()
        )


        for usuario in usuarios:
            print(f"Removendo usuário -- {usuario.usuario_id}")
            print(
            "Usuário:", usuario.usuario_id,
            "Última atividade:", usuario.ultima_atividade,
            "Limite:", limite,
            "Remover?", usuario.ultima_atividade < limite
            )
            usuario.ativo = False

        db.commit()

    finally:
        db.close()


scheduler.add_job(
    remover_usuarios_inativos,
    "interval",
    seconds=30
)