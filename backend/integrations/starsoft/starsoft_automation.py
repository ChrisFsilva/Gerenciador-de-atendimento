import requests


POWER_AUTOMATE_URL = "https://e6f51598a921ebffb719475e56d7f7.e2.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/07/workflows/0e1d9b8203f744ffbcd37f74c53b5221/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hQh3J2SyQdSqdALc2CsS61ZKWQB9rtJ-cqg1lnFoiyo"

def enviar_orcamento(numero_orcamento: str):

    resposta = requests.post(
        POWER_AUTOMATE_URL,
        json={
            "orcamento": numero_orcamento
        },
        timeout=30
    )

    print("STATUS POWER AUTOMATE:", resposta.status_code)
    print("RESPOSTA POWER AUTOMATE:", resposta.text)

    resposta.raise_for_status()

    return resposta.json()