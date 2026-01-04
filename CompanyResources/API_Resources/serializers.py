from rest_framework import serializers
from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa
from CompanyResources.Utente.models import Utente
from CompanyResources.Prenotazione.models import Prenotazione


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


# ============== PRENOTAZIONE ==============
class PrenotazioneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prenotazione
        fields = ['id', 'utente', 'risorsa', 'data_inizio', 'data_fine', 'stato', 'created_at']
        read_only_fields = ['id', 'created_at']

