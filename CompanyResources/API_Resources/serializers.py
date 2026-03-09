import datetime
from jsonschema import ValidationError
from rest_framework import serializers
from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa
from CompanyResources.Utente.models import Utente
from CompanyResources.Prenotazione.models import Prenotazione, PrenotazionePartecipante
from CompanyResources.ActivityLog.models import ActivityLog


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


# ============== PRENOTAZIONE PARTECIPANTE ==============
class PrenotazionePartecipanteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='utente.user.username', read_only=True)

    class Meta:
        model = PrenotazionePartecipante
        fields = ['id', 'username', 'stato']
        read_only_fields = ['id', 'stato']

# ============== PRENOTAZIONE PARTECIPANTE ==============
class PrenotazionePartecipanteSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='utente.user.username', read_only=True)

    class Meta:
        model = PrenotazionePartecipante
        fields = ['id', 'username', 'stato']
        read_only_fields = ['id', 'stato']

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

    # Lista username dei partecipanti in input
    partecipanti_ids = serializers.PrimaryKeyRelatedField(
        queryset=Utente.objects.all(),
        many=True,
        write_only=True,
        required=False
    )
    # Lista partecipanti in output
    partecipanti = PrenotazionePartecipanteSerializer(many=True, read_only=True)

    # Lista username dei partecipanti in input
    partecipanti_ids = serializers.PrimaryKeyRelatedField(
        queryset=Utente.objects.all(),
        many=True,
        write_only=True,
        required=False
    )
    # Lista partecipanti in output
    partecipanti = PrenotazionePartecipanteSerializer(many=True, read_only=True)

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
            'partecipanti_ids',
            'partecipanti',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'stato',
            'utente_id', 'utente_nome',
            'utente_email', 'utente_ruolo',
            'stato_display', 'risorsa'
        ]

    def validate(self, data):
        risorsa = data.get('risorsa')
        partecipanti = data.get('partecipanti_ids', [])

        if risorsa and risorsa.capacita > 1:
            # +1 perché il creatore viene aggiunto automaticamente
            totale = len(partecipanti) + 1
            if totale > risorsa.capacita:
                raise serializers.ValidationError(
                    f"Capacità massima: {risorsa.capacita} persone "
                    f"(stai invitando {totale})"
                )

        return data

    def create(self, validated_data):
        partecipanti = validated_data.pop('partecipanti_ids', [])  # <- deve essere PRIMA
        risorsa = validated_data['risorsa']
        utente = validated_data['utente']

        validated_data['stato'] = 'CONFERMATA' if risorsa.capacita == 1 else 'PENDING'

        prenotazione = Prenotazione.objects.create(**validated_data)  # ora validated_data è pulito

        if risorsa.capacita > 1:
            PrenotazionePartecipante.objects.create(
                prenotazione=prenotazione,
                utente=utente,
                stato='ACCETTATO'
            )
            for partecipante in partecipanti:
                if partecipante != utente:
                    PrenotazionePartecipante.objects.create(
                        prenotazione=prenotazione,
                        utente=partecipante,
                        stato='INVITATO'
                    )

        return prenotazione


# ============== ACTIVITY LOG ==============
class ActivityLogSerializer(serializers.ModelSerializer):
    utente_nome = serializers.CharField(source='utente.user.username', read_only=True)
    risorsa_nome = serializers.CharField(source='prenotazione.risorsa.nome', read_only=True)
    data_inizio = serializers.DateTimeField(source='prenotazione.data_inizio', read_only=True)
    data_fine = serializers.DateTimeField(source='prenotazione.data_fine', read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id',
            'azione',
            'utente_nome',
            'descrizione',
            'risorsa_nome',
            'data_inizio',
            'data_fine',
            'created_at',
        ]
        read_only_fields = fields