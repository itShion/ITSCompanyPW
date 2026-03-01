from .models import Notifica


class NotificaService:
    @staticmethod
    def crea_notifica(utente, titolo, messaggio, tipo):
        from CompanyResources.Notifica.models import Notifica
        Notifica.objects.create(
            utente=utente,
            titolo=titolo,
            messaggio=messaggio,
            tipo=tipo
        )