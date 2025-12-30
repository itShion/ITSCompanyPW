from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, permissions

from API_Resources.permissions import IsOwnerOrReadOnly
from API_Resources.serializers import RisorsaSerializer, TipoRisorsaSerializer, UtenteSerializer
from Risorsa.models import TipoRisorsa, Risorsa
from Utente.models import Utente

__all__ = [
    "RisorsaAPIViewSet",
    "TipoRisorsaAPIViewSet",
    "UtenteAPIViewSet",
]

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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


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
