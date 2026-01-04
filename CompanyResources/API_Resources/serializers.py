from rest_framework import serializers
from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa


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


# ============== PRENOTAZIONE ==============
class PrenotazioneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prenotazione
        fields = ['id', 'utente', 'risorsa', 'data_inizio', 'data_fine', 'stato', 'created_at']
        read_only_fields = ['id', 'created_at']

