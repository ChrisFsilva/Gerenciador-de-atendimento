from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import requests
from app.database import SessionLocal
from app.models import FilaAtendimento

scheduler = BackgroundScheduler()

POWER_AUTOMATE_URL = (
    "https://e6f51598a921ebffb719475e56d7f7.e2.environment.api.powerplatform.com:443"
    "/powerautomate/automations/direct/cu/01/workflows/5ae96b0ceba24a8ca4978a4ca6ff1b92"
    "/triggers/manual/paths/invoke"
    "?api-version=1"
    "&sp=%2Ftriggers%2Fmanual%2Frun"
    "&sv=1.0"
    "&sig=yoes7hhBGFnXYStnptaT7Ixv_i7fM4iZHdAWnwh30oY"
)


def remover_usuarios_inativos():

    db = SessionLocal()

    try:

        agora = datetime.now()

        limite_notificacao = agora - timedelta(minutes=18)
        limite_remocao = agora - timedelta(minutes=20)

        usuarios = (
            db.query(FilaAtendimento)
            .filter(
                FilaAtendimento.ativo == True,
                FilaAtendimento.ultima_atividade < limite_notificacao
            )
            .all()
        )

        for usuario in usuarios:

            print(
                "Usuário:", usuario.usuario_id,
                "Login:", usuario.data_entrada,
                "Última atividade:", usuario.ultima_atividade,
                "Agora:", agora
            )

            # Envia aviso após 8 minutos de inatividade
            resposta = requests.post(
                POWER_AUTOMATE_URL,
                json={
                    "usuario": usuario.usuario_id,
                    "loja": usuario.loja,
                    "email": usuario.email,
                    "ultima_atividade": str(usuario.ultima_atividade)
                },
                timeout=30
            )

            print(
                "Power Automate:",
                resposta.status_code,
                resposta.text
            )

            # Remove somente após 10 minutos
            if usuario.ultima_atividade < limite_remocao:

                print(f"Removendo usuário {usuario.usuario_id}")

                usuario.ativo = False

        db.commit()

    finally:
        db.close()


scheduler.add_job(
    remover_usuarios_inativos,
    "interval",
    seconds=50
)
