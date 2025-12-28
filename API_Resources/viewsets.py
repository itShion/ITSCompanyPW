from rest_framework import viewsets, permissions

from API_Resources.permissions import IsOwnerOrReadOnly
from API_Resources.serializers import RisorsaSerializer, TipoRisorsaSerializer
from Risorsa.models import TipoRisorsa, Risorsa

__all__ = [
    "RisorsaAPIViewSet",
]

class RisorsaAPIViewSet(viewsets.ModelViewSet):
    queryset = Risorsa.objects.all()
    serializer_class = RisorsaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TipoRisorsaAPIViewSet(RisorsaAPIViewSet):
    queryset = TipoRisorsa.objects.all()
    serializer_class = TipoRisorsaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)