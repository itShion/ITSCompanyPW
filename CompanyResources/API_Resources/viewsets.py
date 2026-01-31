from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, permissions

from CompanyResources.API_Resources.serializers import RisorsaSerializer, TipoRisorsaSerializer, UtenteSerializer, PrenotazioneSerializer
from CompanyResources.Risorsa.models import TipoRisorsa, Risorsa
from CompanyResources.Prenotazione.models import Prenotazione
from CompanyResources.Utente.models import Utente

__all__ = [
    "RisorsaAPIViewSet",
    "TipoRisorsaAPIViewSet",
    "UtenteAPIViewSet",
]

#--------------- RISORSE ----------------------
@extend_schema_view(
    list=extend_schema(tags=['Risorse']),
    create=extend_schema(tags=['Risorse']),
    retrieve=extend_schema(tags=['Risorse']),
    update=extend_schema(tags=['Risorse']),
    partial_update=extend_schema(tags=['Risorse']),
    destroy=extend_schema(tags=['Risorse']),
)

class RisorsaAPIViewSet(viewsets.ModelViewSet):
    queryset = Risorsa.objects.all()
    serializer_class = RisorsaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


#--------------- TIPO-RISORSE ----------------------
@extend_schema_view(
    list=extend_schema(tags=['Tipi Risorsa']),
    create=extend_schema(tags=['Tipi Risorsa']),
    retrieve=extend_schema(tags=['Tipi Risorsa']),
    update=extend_schema(tags=['Tipi Risorsa']),
    partial_update=extend_schema(tags=['Tipi Risorsa']),
    destroy=extend_schema(tags=['Tipi Risorsa']),
)
class TipoRisorsaAPIViewSet(viewsets.ModelViewSet):
    queryset = TipoRisorsa.objects.all()
    serializer_class = TipoRisorsaSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]


#--------------- UTENTE ----------------------
@extend_schema_view(
    list=extend_schema(tags=['Utente']),
    create=extend_schema(tags=['Utente']),
    retrieve=extend_schema(tags=['Utente']),
    update=extend_schema(tags=['Utente']),
    partial_update=extend_schema(tags=['Utente']),
    destroy=extend_schema(tags=['Utente']),
)
class UtenteAPIViewSet(viewsets.ModelViewSet):
    queryset = Utente.objects.all()
    serializer_class = UtenteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


#--------------- PRENOTAZIONE ----------------------
@extend_schema_view(
    list=extend_schema(tags=['Prenotazione']),
    create=extend_schema(tags=['Prenotazione']),
    retrieve=extend_schema(tags=['Prenotazione']),
    update=extend_schema(tags=['Prenotazione']),
    partial_update=extend_schema(tags=['Prenotazione']),
    destroy=extend_schema(tags=['Prenotazione']),
)
class PrenotazioneAPIViewSet(viewsets.ModelViewSet):
    serializer_class = PrenotazioneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            utente = Utente.objects.get(user=self.request.user)
            return Prenotazione.objects.filter(utente=utente)
        except Utente.DoesNotExist:
            return Prenotazione.objects.none()

    def perform_create(self, serializer):
        utente, created = Utente.objects.get_or_create(
            user=self.request.user,
            defaults={
                'ruolo': 'USER',  # Valore di default
                'telefono': ''  # Valore di default
            }
        )
        print(f"DEBUG - Utente: {utente.id}, User: {self.request.user.id}")
        serializer.save(utente=utente)
