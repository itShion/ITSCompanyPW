import datetime

from jsonschema import ValidationError
from rest_framework import serializers
from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa
from CompanyResources.Utente.models import Utente
from CompanyResources.Prenotazione.models import Prenotazione


# ============== TIPO RISORSA ==============
class TipoRisorsaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoRisorsa
        fields = ['id', 'nome', 'descrizione', 'immagine_url']
        read_only_fields = ['id']

# ============== RISORSA ==============
class RisorsaSerializer(serializers.ModelSerializer):
    tipo = TipoRisorsaSerializer(read_only=True)
    tipo_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoRisorsa.objects.all(),
        source='tipo',
        write_only=True
    )

    class Meta:
        model = Risorsa
        fields = [
            'id', 'nome', 'descrizione', 'capacita',
            'tipo', 'tipo_id',
            'orario_apertura', 'orario_chiusura',
            'lunedi', 'martedi', 'mercoledi', 'giovedi',
            'venerdi', 'sabato', 'domenica',
            'attiva',
        ]
        read_only_fields = ['id', 'created_at']

# ============== UTENTE ==============
class UtenteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email =  serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Utente
        fields = ['id', 'user', 'username', 'email', 'first_name', 'last_name',
                  'ruolo', 'telefono']
        read_only_fields = ['id', 'user']

    def to_representation(self, instance):

        data = super().to_representation(instance)
        data['ruolo_etichetta'] = instance.get_ruolo_display()
        return data


# ============== PRENOTAZIONE ==============
class PrenotazioneSerializer(serializers.ModelSerializer):
    risorsa = RisorsaSerializer(read_only=True)

    risorsa_id = serializers.PrimaryKeyRelatedField(
        queryset=Risorsa.objects.all(),
        source='risorsa',
        write_only=True
    )

    utente_id = serializers.IntegerField(source='utente.id', read_only=True)
    utente_nome = serializers.CharField(source='utente.user.username', read_only=True)
    utente_email = serializers.EmailField(source='utente.user.email', read_only=True)
    utente_ruolo = serializers.CharField(source='utente.get_ruolo_display', read_only=True)

    stato_display = serializers.CharField(source='get_stato_display', read_only=True)

    class Meta:
        model = Prenotazione
        fields = [
            'id',
            'risorsa', 'risorsa_id',
            'utente_id', 'utente_nome',
            'utente_email', 'utente_ruolo',
            'data_inizio', 'data_fine',
            'stato', 'stato_display',
            'motivo',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'stato',
            'utente_id', 'utente_nome',
            'utente_email', 'utente_ruolo',
            'stato_display', 'risorsa'
        ]


