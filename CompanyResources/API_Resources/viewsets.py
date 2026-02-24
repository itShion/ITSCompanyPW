from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, permissions

from CompanyResources.API_Resources.serializers import RisorsaSerializer, TipoRisorsaSerializer, UtenteSerializer, PrenotazioneSerializer
from CompanyResources.Risorsa.models import TipoRisorsa, Risorsa
from CompanyResources.Prenotazione.models import Prenotazione
from CompanyResources.Utente.models import Utente

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


from rest_framework.decorators import action 
from django.utils import timezone
from rest_framework.response import Response

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
            if utente.ruolo == 'Admin':
                return Prenotazione.objects.all()
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
        serializer.save(utente=utente)
        
    @action(detail=False, methods=['get'])
    def attive(self, request):
        """Restituisce solo le prenotazioni attive (confermate e con data_inizio >= oggi)"""
        try:
            utente = Utente.objects.get(user=self.request.user)
            oggi = timezone.now().date()
            
            prenotazioni = Prenotazione.objects.filter(
                utente=utente,
                stato='confermata',
                data_inizio__gte=oggi 
            ).order_by('data_inizio', 'data_fine')
            
            serializer = self.get_serializer(prenotazioni, many=True)
            return Response(serializer.data)
        except Utente.DoesNotExist:
            return Response([])

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Restituisce solo le prenotazioni in attesa di approvazione"""
        try:
            
            prenotazioni = Prenotazione.objects.filter(
                stato='pending'
            ).order_by('-data_inizio', '-data_fine')
            
            serializer = self.get_serializer(prenotazioni, many=True)
            return Response(serializer.data)
        except Utente.DoesNotExist:
            return Response([])

    @action(detail=False, methods=['get'])
    def storiche(self, request):
        """Restituisce le prenotazioni passate"""
        try:
            utente = Utente.objects.get(user=self.request.user)
            oggi = timezone.now().date()
            
            prenotazioni = Prenotazione.objects.filter(
                utente=utente,
                data_inizio__lt=oggi
            ).order_by('-data_inizio', '-data_fine')
            
            serializer = self.get_serializer(prenotazioni, many=True)
            return Response(serializer.data)
        except Utente.DoesNotExist:
            return Response([])
        
    # AZIONI di HR
    
    @action(detail=True, methods=['post'])
    def approva(self, request, pk=None):
        prenotazione = self.get_object()
        prenotazione.stato = 'CONFERMATA'
        prenotazione.save()
        return Response(self.get_serializer(prenotazione).data)

    @action(detail=True, methods=['post'])
    def rifiuta(self, request, pk=None):
        prenotazione = self.get_object()
        prenotazione.stato = 'ANNULLATA'
        prenotazione.save()
        return Response(self.get_serializer(prenotazione).data)

    @action(detail=True, methods=['post'])
    def annulla(self, request, pk=None):
        prenotazione = self.get_object()
        utente = Utente.objects.get(user=request.user)
        if prenotazione.utente != utente:
            return Response({'error': 'Non autorizzato'}, status=403)
        prenotazione.stato = 'ANNULLATA'
        prenotazione.save()
        return Response(self.get_serializer(prenotazione).data)
