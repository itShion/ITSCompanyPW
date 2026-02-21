import datetime

from jsonschema import ValidationError
from rest_framework import serializers
from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa
from CompanyResources.Utente.models import Utente
from CompanyResources.Prenotazione.models import Prenotazione


# ============== RISORSE ==============
class TipoRisorsaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoRisorsa
        fields = ['id', 'nome', 'descrizione', 'immagine_url']
        read_only_fields = ['id']


class RisorsaSerializer(serializers.ModelSerializer):
    # 🔹 OUTPUT: oggetto completo
    tipo = TipoRisorsaSerializer(read_only=True)

    # 🔹 INPUT: accetta solo l'id
    tipo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoRisorsa.objects.all(),
        source='tipo',
        write_only=True
    )

    class Meta:
        model = Risorsa
        fields = [
            'id', 'nome', 'descrizione', 'capacita',
            'tipo',        # GET → oggetto
            'tipo_id',     # POST/PUT → id
            'orario_apertura', 'orario_chiusura',
            'lunedi', 'martedi', 'mercoledi', 'giovedi',
            'venerdi', 'sabato', 'domenica',
            'attiva',
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
    risorsa = RisorsaSerializer(read_only=True)

    risorsa_id = serializers.PrimaryKeyRelatedField(
        queryset=Risorsa.objects.all(),
        source='risorsa',
        write_only=True
    )

    utente_nome = serializers.CharField(source='utente.username', read_only=True)
    stato_display = serializers.CharField(source='get_stato_display', read_only=True)

    class Meta:
        model = Prenotazione
        fields = [
            'id',
            'risorsa',
            'risorsa_id',
            'utente', 'utente_nome',
            'data_inizio', 'data_fine',
            'stato', 'stato_display', 'motivo',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'utente', 'created_at', 'updated_at',
            'risorsa', 'utente_nome', 'stato_display'
        ]


