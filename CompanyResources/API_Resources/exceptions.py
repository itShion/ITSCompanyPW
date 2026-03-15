from rest_framework.exceptions import APIException
from rest_framework import status


class NonAutorizzato(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'Non hai i permessi per eseguire questa azione.'
    default_code = 'non_autorizzato'


class PrenotazioneConflitto(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'La risorsa è già prenotata in questo intervallo.'
    default_code = 'prenotazione_conflitto'


class RisorsaNonDisponibile(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'La risorsa non è disponibile o non è attiva.'
    default_code = 'risorsa_non_disponibile'


class PrenotazioneNonModificabile(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'La prenotazione non può essere modificata nel suo stato attuale.'
    default_code = 'prenotazione_non_modificabile'