from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, permissions, status

from CompanyResources.API_Resources.serializers import RisorsaSerializer, TipoRisorsaSerializer, UtenteSerializer, PrenotazioneSerializer
from CompanyResources.Risorsa.models import TipoRisorsa, Risorsa
from CompanyResources.Prenotazione.models import Prenotazione
from CompanyResources.Utente.models import Utente
from CompanyResources.API_Resources.exceptions import NonAutorizzato, PrenotazioneNonModificabile  # ← nuovo

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework.response import Response

__all__ = [
    "RisorsaAPIViewSet",
    "TipoRisorsaAPIViewSet",
    "UtenteAPIViewSet",
    "PrenotazioneAPIViewSet",  # ← era mancante
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
@method_decorator(csrf_exempt, name='dispatch')
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
@method_decorator(csrf_exempt, name='dispatch')
class TipoRisorsaAPIViewSet(viewsets.ModelViewSet):
    queryset = TipoRisorsa.objects.all()
    serializer_class = TipoRisorsaSerializer


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
            if utente.ruolo == 'Admin':
                return Prenotazione.objects.all()
            return Prenotazione.objects.filter(utente=utente)
        except Utente.DoesNotExist:
            return Prenotazione.objects.none()

    def perform_create(self, serializer):
        utente, _ = Utente.objects.get_or_create(
            user=self.request.user,
            defaults={'ruolo': 'USER', 'telefono': ''}
        )
        serializer.save(utente=utente)

    @action(detail=False, methods=['get'])
    def attive(self, request):
        """Restituisce solo le prenotazioni attive (confermate e con data_inizio >= oggi)"""
        utente = Utente.objects.get(user=request.user)
        oggi = timezone.now().date()
        qs = Prenotazione.objects.filter(
            utente=utente,
            stato='CONFERMATA',          # ← era 'confermata' (minuscolo), corretto
            data_inizio__date__gte=oggi  # ← era data_inizio__gte=oggi (confrontava datetime con date)
        ).order_by('data_inizio', 'data_fine')
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Restituisce solo le prenotazioni in attesa di approvazione"""
        qs = Prenotazione.objects.filter(
            stato='PENDING'              # ← era 'pending' (minuscolo), corretto
        ).order_by('-data_inizio', '-data_fine')
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def storiche(self, request):
        """Restituisce le prenotazioni passate"""
        utente = Utente.objects.get(user=request.user)
        oggi = timezone.now().date()
        qs = Prenotazione.objects.filter(
            utente=utente,
            data_inizio__date__lt=oggi   # ← era data_inizio__lt=oggi (stesso fix di sopra)
        ).order_by('-data_inizio', '-data_fine')
        return Response(self.get_serializer(qs, many=True).data)

    # AZIONI HR

    @action(detail=True, methods=['post'])
    def approva(self, request, pk=None):
        prenotazione = self.get_object()
        if prenotazione.stato != 'PENDING':
            raise PrenotazioneNonModificabile(
                f'Solo le prenotazioni PENDING possono essere approvate (stato attuale: {prenotazione.stato}).'
            )
        prenotazione.stato = 'CONFERMATA'
        prenotazione.save()
        prenotazione.crea_notifica_approvazione()
        return Response(self.get_serializer(prenotazione).data)

    @action(detail=True, methods=['post'])
    def rifiuta(self, request, pk=None):
        prenotazione = self.get_object()
        if prenotazione.stato != 'PENDING':
            raise PrenotazioneNonModificabile(
                f'Solo le prenotazioni PENDING possono essere rifiutate (stato attuale: {prenotazione.stato}).'
            )
        prenotazione.stato = 'ANNULLATA'
        prenotazione.save()
        return Response(self.get_serializer(prenotazione).data)

    @action(detail=True, methods=['post'])
    def annulla(self, request, pk=None):
        prenotazione = self.get_object()
        try:
            utente = Utente.objects.get(user=request.user)
        except Utente.DoesNotExist:
            raise NonAutorizzato()

        if prenotazione.utente != utente:
            raise NonAutorizzato('Non puoi annullare una prenotazione altrui.')

        if prenotazione.stato == 'ANNULLATA':
            raise PrenotazioneNonModificabile('La prenotazione è già annullata.')

        prenotazione.stato = 'ANNULLATA'
        prenotazione.save()
        return Response(self.get_serializer(prenotazione).data)