from django.db import models
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, status
from CompanyResources.API_Resources.permissions import IsUtente, IsResponsabile, IsAdmin, IsResponsabileOrAdmin, IsOwnerOrResponsabile
from CompanyResources.API_Resources.serializers import RisorsaSerializer, TipoRisorsaSerializer, UtenteSerializer, PrenotazioneSerializer, ActivityLogSerializer
from CompanyResources.Risorsa.models import TipoRisorsa, Risorsa
from CompanyResources.Prenotazione.models import Prenotazione
from CompanyResources.Utente.models import Utente
from CompanyResources.ActivityLog.models import ActivityLog
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from CompanyResources.API_Resources.exceptions import NonAutorizzato, PrenotazioneNonModificabile  
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework.response import Response

from CompanyResources.Prenotazione.models import Prenotazione, PrenotazionePartecipante

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

    """tutti possono visualizzare le risorse ma solo i responsabili/admin possono
    effettuare la creazione la modifica e la cancellazione di essi"""

    queryset = Risorsa.objects.all()
    serializer_class = RisorsaSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):

        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsResponsabileOrAdmin]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


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

    """tutti possono visualizzare i tipi di risorse ma solo i responsabili/admin possono
        effettuare la creazione la modifica e la cancellazione di essi"""

    queryset = TipoRisorsa.objects.all()
    serializer_class = TipoRisorsaSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):

        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsResponsabileOrAdmin]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


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

    """"solo gli admin e i responsabili possono gestire gli utenti"""

    queryset = Utente.objects.all()
    serializer_class = UtenteSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):

        self.permission_classes = [IsAuthenticated, IsResponsabileOrAdmin]
        return super().get_permissions()

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

    """tutti possono vedere e creare/cancellare/modificare le prenotazioni, con la particolarità
    che l'utente può vedere e creare/cancellare/modificare solo le sue mentre admin e responsabile
    possono vedere e creare/cancellare/modificare le prenotazioni per tutti"""

    serializer_class = PrenotazioneSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):

        if self.action == 'create':
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['partial_update', 'update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwnerOrResponsabile]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        try:
            utente = Utente.objects.get(user=self.request.user)

            if utente.ruolo in ['Admin', 'RESPONSABILE'] or self.request.user.is_superuser:
                return Prenotazione.objects.select_related(
                    'utente__user', 'risorsa__tipo'
                ).all()

            # Dipendente vede le sue + quelle a cui partecipa
            return Prenotazione.objects.select_related(
                'utente__user', 'risorsa__tipo'
            ).filter(
                models.Q(utente=utente) |
                models.Q(partecipanti__utente=utente)
            ).distinct()
            
        except Utente.DoesNotExist:
            return Prenotazione.objects.none()

    def perform_create(self, serializer):

        utente = self.request.user.utente
        prenotazione = serializer.save(utente=utente)  # fix: assegnato
        ActivityLog.objects.create(
            azione='CREATA',
            utente=utente,
            prenotazione=prenotazione,
            descrizione=f"{utente.user.username} ha creato una prenotazione #{prenotazione.id}"
        )

    # ---- AZIONI DIPENDENTE ----
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
        utente = Utente.objects.get(user=request.user)

        if prenotazione.utente != utente:
            return Response({'error': 'Non autorizzato'}, status=403)

        if prenotazione.stato == 'ANNULLATA':
            return Response({'error': 'Prenotazione già annullata'}, status=400)

        prenotazione.stato = 'ANNULLATA'
        prenotazione.save()
        ActivityLog.objects.create(
            azione='ANNULLATA',
            utente=utente,
            prenotazione=prenotazione,
            descrizione=f"{utente.user.username} ha annullato la prenotazione #{prenotazione.id}"
        )
        return Response(self.get_serializer(prenotazione).data)

    @action(detail=True, methods=['post'])
    def rifiuta_partecipazione(self, request, pk=None):
        prenotazione = self.get_object()
        utente = Utente.objects.get(user=request.user)

        try:
            partecipante = PrenotazionePartecipante.objects.get(
                prenotazione=prenotazione,
                utente=utente
            )
        except PrenotazionePartecipante.DoesNotExist:
            return Response({'error': 'Non sei un partecipante'}, status=404)

        if partecipante.stato == 'RIFIUTATO':
            return Response({'error': 'Hai già rifiutato'}, status=400)

        if prenotazione.utente == utente:
            return Response({'error': 'Sei il creatore, usa annulla invece'}, status=400)

        partecipante.stato = 'RIFIUTATO'
        partecipante.save()
        ActivityLog.objects.create(
            azione='PARTECIPANTE_RIFIUTATO',
            utente=utente,
            prenotazione=prenotazione,
            descrizione=f"{utente.user.username} ha rifiutato la partecipazione alla prenotazione #{prenotazione.id}"
        )
        return Response(self.get_serializer(prenotazione).data)

    @action(detail=True, methods=['post'])
    def accetta_partecipazione(self, request, pk=None):
        prenotazione = self.get_object()
        utente = Utente.objects.get(user=request.user)

        try:
            partecipante = PrenotazionePartecipante.objects.get(
                prenotazione=prenotazione,
                utente=utente
            )
        except PrenotazionePartecipante.DoesNotExist:
            return Response({'error': 'Non sei un partecipante'}, status=404)

        if partecipante.stato == 'ACCETTATO':
            return Response({'error': 'Hai già accettato'}, status=400)

        partecipante.stato = 'ACCETTATO'
        partecipante.save()
        ActivityLog.objects.create(
            azione='PARTECIPANTE_ACCETTATO',
            utente=utente,
            prenotazione=prenotazione,
            descrizione=f"{utente.user.username} ha accettato la partecipazione alla prenotazione #{prenotazione.id}"
        )
        return Response(self.get_serializer(prenotazione).data)

    # ---- AZIONI HR ----

    @action(detail=True, methods=['post'])
    def approva(self, request, pk=None):
        prenotazione = self.get_object()
        utente = Utente.objects.get(user=request.user)  # fix: aggiunto

        if prenotazione.stato != 'PENDING':
            return Response(
                {'error': f'Impossibile approvare, stato attuale: {prenotazione.stato}'},
                status=400
            )

        prenotazione.stato = 'CONFERMATA'
        prenotazione.save()
        ActivityLog.objects.create(
            azione='CONFERMATA',
            utente=utente,
            prenotazione=prenotazione,
            descrizione=f"{utente.user.username} ha confermato la prenotazione #{prenotazione.id}"
        )
        return Response(self.get_serializer(prenotazione).data)

    @action(detail=True, methods=['post'])
    def rifiuta(self, request, pk=None):
        prenotazione = self.get_object()
        utente = Utente.objects.get(user=request.user)  # fix: aggiunto

        if prenotazione.stato != 'PENDING':
            return Response(
                {'error': f'Impossibile rifiutare, stato attuale: {prenotazione.stato}'},
                status=400
            )

        prenotazione.stato = 'ANNULLATA'
        prenotazione.save()
        ActivityLog.objects.create(
            azione='RIFIUTATA',
            utente=utente,
            prenotazione=prenotazione,
            descrizione=f"{utente.user.username} ha rifiutato la prenotazione #{prenotazione.id}"
        )
        return Response(self.get_serializer(prenotazione).data)

    # ---- FILTRI ----

    @action(detail=False, methods=['get'])
    def attive(self, request):
        utente = Utente.objects.get(user=request.user)
        oggi = timezone.now().date()

        prenotazioni = Prenotazione.objects.filter(
            models.Q(utente=utente) | models.Q(partecipanti__utente=utente),
            stato='CONFERMATA',
            data_inizio__gte=oggi
        ).distinct().order_by('data_inizio')

        return Response(self.get_serializer(prenotazioni, many=True).data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        prenotazioni = Prenotazione.objects.filter(
            stato='PENDING'
        ).order_by('-data_inizio')

        return Response(self.get_serializer(prenotazioni, many=True).data)

    @action(detail=False, methods=['get'])
    def storiche(self, request):
        utente = Utente.objects.get(user=request.user)
        oggi = timezone.now().date()

        prenotazioni = Prenotazione.objects.filter(
            models.Q(utente=utente) | models.Q(partecipanti__utente=utente),
            data_inizio__lt=oggi
        ).distinct().order_by('-data_inizio')

        return Response(self.get_serializer(prenotazioni, many=True).data)

#--------------- ACTIVITY LOG ----------------------
class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ActivityLog.objects.select_related(
            'utente__user',
            'prenotazione__risorsa'
        ).all()[:50]
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
