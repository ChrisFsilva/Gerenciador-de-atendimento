from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, timezone

from app.database import SessionLocal
from app.models import FilaAtendimento

scheduler = BackgroundScheduler()


def remover_usuarios_inativos():

    db = SessionLocal()

    try:
        agora = datetime.now()
        limite = agora-timedelta(minutes=10)

        usuarios = (
            db.query(FilaAtendimento)
            .filter(
                FilaAtendimento.ativo == True,
                FilaAtendimento.ultima_atividade < limite
            )
            .all()
        )


        for usuario in usuarios:
            
            print(
            "Usuário:", usuario.usuario_id,
            "login", usuario.data_entrada,
            "Última atividade:", usuario.ultima_atividade,
            "Agora é:", agora,
            "Limite:", limite,
            "Remover usuario?", agora > limite
            )
            print(f"Removendo usuário -- {usuario.usuario}")
            usuario.ativo = False

        db.commit()

    finally:
        db.close()


scheduler.add_job(
    remover_usuarios_inativos,
    "interval",
    seconds=10
)