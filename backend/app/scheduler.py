from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import requests

from app.database import SessionLocal
from app.models import FilaAtendimento
from app.heartbeat_state import heartbeats_locais

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

            ultimo_heartbeat_local = heartbeats_locais.get(
                usuario.usuario_id
            )

            print(
                "Usuário:", usuario.usuario_id,
                "Login:", usuario.data_entrada,
                "Última atividade DB:", usuario.ultima_atividade,
                "Último heartbeat local:", ultimo_heartbeat_local,
                "Agora:", agora
            )

            # Se nunca recebeu heartbeat local,
            # mantém o comportamento baseado no banco.
            if ultimo_heartbeat_local is None:
                tempo_heartbeat_local = None
            else:
                tempo_heartbeat_local = (
                    agora - ultimo_heartbeat_local
                )

            tempo_atividade_db = (
                agora - usuario.ultima_atividade
            )

            # ==========================================
            # ENVIO DA NOTIFICAÇÃO
            # ==========================================

            resposta = requests.post(
                POWER_AUTOMATE_URL,
                json={
                    "usuario": usuario.usuario_id,
                    "loja": usuario.loja,
                    "email": usuario.email,
                    "ultima_atividade": str(
                        usuario.ultima_atividade
                    )
                },
                timeout=30
            )

            print(
                "Power Automate:",
                resposta.status_code,
                resposta.text
            )

            # ==========================================
            # REMOÇÃO
            # ==========================================

            banco_expirado = (
                tempo_atividade_db > timedelta(minutes=20)
            )

            heartbeat_local_expirado = (
                tempo_heartbeat_local is not None
                and
                tempo_heartbeat_local > timedelta(minutes=20)
            )

            if banco_expirado and heartbeat_local_expirado:

                print(
                    f"REMOVENDO usuário {usuario.usuario_id} | "
                    f"DB={tempo_atividade_db} | "
                    f"LOCAL={tempo_heartbeat_local}"
                )

                usuario.ativo = False

            else:

                print(
                    f"MANTENDO usuário {usuario.usuario_id} | "
                    f"DB={tempo_atividade_db} | "
                    f"LOCAL={tempo_heartbeat_local}"
                )

        db.commit()

    finally:
        db.close()


scheduler.add_job(
    remover_usuarios_inativos,
    "interval",
    seconds=50
)