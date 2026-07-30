import requests

POWER_AUTOMATE_URL = "https://e6f51598a921ebffb719475e56d7f7.e2.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/09/workflows/45a9b59932294b639e38b9cfe6a51905/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HNJW3KWb1wSaVaGXQD0X4SWgvea2GtswxqpBbcZLk38"

def enviar_agfuturo(agend_cliente: str, agend_date: str, agend_hour: str ):

    resposta = requests.post(
        POWER_AUTOMATE_URL,
        json={
            "cliente": agend_cliente,
            "Data": agend_date,
        },
        timeout=30
    )

    print("STATUS POWER AUTOMATE:", resposta.status_code)
    print("RESPOSTA POWER AUTOMATE:", resposta.text)

    resposta.raise_for_status()

    # return resposta.json()