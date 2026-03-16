from django.db import models
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, status
from CompanyResources.API_Resources.permissions import IsUtente, IsResponsabile, IsAdmin, IsResponsabileOrAdmin, IsOwnerOrResponsabile
from CompanyResources.API_Resources.serializers import RisorsaSerializer, TipoRisorsaSerializer, UtenteSerializer, PrenotazioneSerializer, ActivityLogSerializer
from CompanyResources.Risorsa.models import TipoRisorsa, Risorsa
from CompanyResources.Prenotazione.models import Prenotazione, PrenotazionePartecipante
from CompanyResources.Utente.models import Utente

from django.contrib.auth.models import User
from CompanyResources.ActivityLog.models import ActivityLog
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from CompanyResources.API_Resources.exceptions import NonAutorizzato, PrenotazioneNonModificabile
from rest_framework.decorators import action
from django.utils import timezone
from datetime import date
from rest_framework.response import Response
from CompanyResources.Prenotazione.models import Prenotazione, PrenotazionePartecipante

__all__ = [
    "RisorsaAPIViewSet",
    "TipoRisorsaAPIViewSet",
    "UtenteAPIViewSet",
    "PrenotazioneAPIViewSet",
]

# --------------- RISORSE ----------------------
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

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsResponsabileOrAdmin]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def attiva(self, request, pk=None):
        risorsa = self.get_object()
        risorsa.stato = 'ATTIVA'
        risorsa.save()
        return Response(self.get_serializer(risorsa).data)

    @action(detail=True, methods=['post'])
    def manutenzione(self, request, pk=None):
        risorsa = self.get_object()
        risorsa.stato = 'MANUTENZIONE'
        risorsa.save()
        return Response(self.get_serializer(risorsa).data)

    @action(detail=True, methods=['post'])
    def disattiva(self, request, pk=None):
        risorsa = self.get_object()
        risorsa.stato = 'DISATTIVA'
        risorsa.save()
        return Response(self.get_serializer(risorsa).data)

    def destroy(self, request, *args, **kwargs):
        risorsa = self.get_object()
        prenotazioni_attive = Prenotazione.objects.filter(
            risorsa=risorsa,
            stato__in=['PENDING', 'CONFERMATA']
        ).exists()
        if prenotazioni_attive:
            return Response(
                {'error': 'Impossibile eliminare: la risorsa ha prenotazioni attive'},
                status=400
            )
        return super().destroy(request, *args, **kwargs)


# --------------- TIPO-RISORSE ----------------------
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

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsResponsabileOrAdmin]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


# --------------- UTENTE ----------------------
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

    """"solo gli admin e i responsabili possono gestire gli utenti"""

    # queryset = Utente.objects.all()
    serializer_class = UtenteSerializer

    def get_queryset(self):
        mostra_disabilitati = self.request.query_params.get('disabilitati') == 'true'
        mostra_all = self.request.query_params.get('all') == 'true'

        if mostra_all:
            return Utente.objects.select_related('user').all()
        if mostra_disabilitati:
            return Utente.objects.select_related('user').filter(user__is_active=False)
        return Utente.objects.select_related('user').filter(user__is_active=True)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsResponsabileOrAdmin]
        else:
            self.permission_classes = [IsAuthenticated]  # tutti possono leggere
        return super().get_permissions()

    def perform_create(self, serializer):
        username = self.request.data.get('username')
        email = self.request.data.get('email', '')
        password = self.request.data.get('password', '')
        telefono = self.request.data.get('telefono', '')
        first_name = self.request.data.get('first_name', '')
        last_name = self.request.data.get('last_name', '')
        ruolo = self.request.data.get('ruolo', 'Dipendente')

        if User.objects.filter(username=username).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'username': 'Username già esistente'})

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        serializer.save(user=user, ruolo=ruolo, telefono=telefono)

    def destroy(self, request, *args, **kwargs):

        """Disabilita l'utente invece di cancellarlo"""

        utente = self.get_object()
        utente.user.is_active = False
        utente.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def riabilita(self, request, pk=None):

        """Riabilita un utente disabilitato"""

        try:
            utente = Utente.objects.select_related('user').get(pk=pk, user__is_active=False)
            utente.user.is_active = True
            utente.user.save()
            return Response({'message': 'Utente riabilitato'}, status=status.HTTP_200_OK)
        except Utente.DoesNotExist:
            return Response({'error': 'Utente non trovato o già attivo'}, status=status.HTTP_404_NOT_FOUND)


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

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['partial_update', 'update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsOwnerOrResponsabile]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):

        user = self.request.user

        try:
            utente = Utente.objects.get(user=self.request.user)
            oggi = date.today()

            if utente.ruolo in ['ADMIN', 'RESPONSABILE'] or self.request.user.is_superuser:
                return Prenotazione.objects.select_related(
                    'utente__user', 'risorsa__tipo'
                ).filter(data_inizio__date__gte=oggi)

            return Prenotazione.objects.select_related(
                'utente__user', 'risorsa__tipo'
            ).filter(
                models.Q(utente=utente) |
                models.Q(partecipanti__utente=utente),
                data_inizio__date__gte=oggi
            ).distinct()

        except Utente.DoesNotExist:
            return Prenotazione.objects.none()

    def perform_create(self, serializer):
        utente = self.request.user.utente
        prenotazione = serializer.save(utente=utente)
        ActivityLog.objects.create(
            azione='CREATA',
            utente=utente,
            prenotazione=prenotazione,
            descrizione=f"{utente.user.username} ha creato una prenotazione #{prenotazione.id}"
        )

    # ---- AZIONI DIPENDENTE ----

    @action(detail=True, methods=['patch'])
    def modifica_motivo(self, request, pk=None):
        prenotazione = self.get_object()
        utente = Utente.objects.get(user=request.user)

        if prenotazione.utente != utente:
            return Response({'error': 'Non autorizzato'}, status=403)

        if prenotazione.stato == 'ANNULLATA':
            return Response({'error': 'Non puoi modificare una prenotazione annullata'}, status=400)

        motivo = request.data.get('motivo', '').strip()
        prenotazione.motivo = motivo
        prenotazione.save()

        return Response(self.get_serializer(prenotazione).data)

    # ---- AZIONI DIPENDENTE ----

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

    # ---- AZIONI HR ----

    @action(detail=True, methods=['post'])
    def approva(self, request, pk=None):
        prenotazione = self.get_object()
        utente = Utente.objects.get(user=request.user)

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
        utente = Utente.objects.get(user=request.user)

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

    @action(detail=False, methods=['get'])
    def mie(self, request):
        utente = Utente.objects.get(user=request.user)
        oggi = date.today()

        prenotazioni = Prenotazione.objects.select_related(
            'utente__user', 'risorsa__tipo'
        ).filter(
            models.Q(utente=utente) |
            models.Q(partecipanti__utente=utente),
            data_inizio__date__gte=oggi
        ).distinct().order_by('data_inizio')

        return Response(self.get_serializer(prenotazioni, many=True).data)


# --------------- ACTIVITY LOG ----------------------
class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ActivityLog.objects.select_related(
            'utente__user',
            'prenotazione__risorsa'
        ).all()[:50]