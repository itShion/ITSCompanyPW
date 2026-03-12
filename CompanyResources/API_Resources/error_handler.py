import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError

logger = logging.getLogger('companyresources')


def custom_exception_handler(exc, context):
    # Converte ValidationError di Django (da model.clean()) in errore DRF
    if isinstance(exc, DjangoValidationError):
        from rest_framework.exceptions import ValidationError as DRFValidationError
        exc = DRFValidationError(detail=exc.messages)

    response = exception_handler(exc, context)
    view = context.get('view')
    request = context.get('request')

    logger.warning(
        f"[{response.status_code if response else 500}] "
        f"{view.__class__.__name__ if view else 'Unknown'} | "
        f"Utente: {request.user if request else 'N/A'} | "
        f"Errore: {exc}"
    )

    if response is not None:
        return Response({
            'errore': True,
            'codice': response.status_code,
            'dettaglio': _normalizza_errori(response.data),
        }, status=response.status_code)

    logger.error(f"Errore non gestito: {exc}", exc_info=True)
    return Response({
        'errore': True,
        'codice': status.HTTP_500_INTERNAL_SERVER_ERROR,
        'dettaglio': 'Errore interno del server. Contatta l\'amministratore.',
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def _normalizza_errori(data):
    if isinstance(data, list):
        return ' '.join(str(e) for e in data)
    if isinstance(data, dict):
        msgs = []
        for field, errors in data.items():
            if field == 'non_field_errors':
                msgs.append(', '.join(str(e) for e in errors))
            elif isinstance(errors, list):
                msgs.append(f"{field}: {', '.join(str(e) for e in errors)}")
            else:
                msgs.append(f"{field}: {errors}")
        return ' | '.join(msgs)
    return str(data)