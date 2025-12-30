from rest_framework import serializers
from Risorsa.models import Risorsa, TipoRisorsa
from Prenotazione.models import Prenotazione
from Utente.models import Utente


# ============== RISORSE ==============
class TipoRisorsaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoRisorsa
        fields = ['id', 'nome', 'descrizione']
        read_only_fields = ['id']


class RisorsaSerializer(serializers.ModelSerializer):
    tipo_nome = serializers.CharField(source='tipo.nome', read_only=True)
    tipo_descrizione = serializers.CharField(source='tipo.descrizione', read_only=True)

    class Meta:
        model = Risorsa
        fields = [
            'id', 'nome', 'descrizione', 'is_available',
            'capacita', 'tipo', 'tipo_nome', 'tipo_descrizione'
        ]
        read_only_fields = ['id', 'tipo_nome', 'tipo_descrizione']


# ============== UTENTE ==============
class UtenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utente
        fields = ['id', 'user', 'ruolo', 'telefono']
        read_only_fields = ['id']
