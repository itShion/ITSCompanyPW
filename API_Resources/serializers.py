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
    tipo = TipoRisorsaSerializer(read_only=True)  # GET: restituisce l'oggetto completo
    tipo_id = serializers.IntegerField(write_only=True, source='tipo.id')  # POST/PUT: accetta solo l'ID

    class Meta:
        model = Risorsa
        fields = [
            'id', 'nome', 'descrizione', 'is_available',
            'capacita', 'tipo', 'tipo_id'
        ]
        read_only_fields = ['id']


# ============== UTENTE ==============
class UtenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utente
        fields = ['id', 'user', 'ruolo', 'telefono']
        read_only_fields = ['id']
