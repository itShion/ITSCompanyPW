from django.shortcuts import render
# Notifica/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notifica
from .serializers import NotificaSerializer
from CompanyResources.Utente.models import Utente

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifiche_unread(request):
    utente = Utente.objects.get(user=request.user)

    notifiche = Notifica.objects.filter(
        utente=utente,
        letta=False
    ).order_by('-created_at')

    serializer = NotificaSerializer(notifiche, many=True)

    return Response({
        "count": notifiche.count(),
        "results": serializer.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_read(request, id):
    try:
        utente = Utente.objects.get(user=request.user)

        notifica = Notifica.objects.get(
            id=id,
            utente=utente
        )

        notifica.letta = True
        notifica.save()

        return Response({"ok": True})

    except Notifica.DoesNotExist:
        return Response(
            {"ok": False, "error": "Notifica non trovata"},
            status=404
        )