from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import requests

from app.database import SessionLocal
from app.models import FilaAtendimento
from app.heartbeat_state import heartbeats_locais

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger


scheduler = BackgroundScheduler()

def encerrar_fila_diariamente():
    db = SessionLocal()

    try:
        quantidade = (
            db.query(FilaAtendimento)
            .filter(
                FilaAtendimento.ativo == True
            )
            .update(
                {"ativo": False},
                synchronize_session=False
            )
        )

        db.commit()

        print(
            f"ENCERRAMENTO DIÁRIO: "
            f"{quantidade} usuários removidos da fila."
        )

    finally:
        db.close()

scheduler.add_job(
    encerrar_fila_diariamente,
    CronTrigger(
        hour=23,
        minute=0
    )
)