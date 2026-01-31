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
    tipo = serializers.PrimaryKeyRelatedField(
        queryset=TipoRisorsa.objects.all()
    )

    class Meta:
        model = Risorsa
        fields = [
            'id', 'nome', 'descrizione', 'is_available',
            'capacita', 'tipo'
        ]
        read_only_fields = ['id' ]


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
        fields = ['id', 'risorsa', 'data_inizio', 'data_fine', 'stato', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        if data['data_fine'] <= data['data_inizio']:
            raise serializers.ValidationError("Data fine deve essere successiva a data inizio")

        risorsa = data['risorsa']
        start = data['data_inizio']
        end = data['data_fine']
        overlap = Prenotazione.objects.filter(
            risorsa=risorsa,
            data_inizio__lt=end,
            data_fine__gt=start
        )
        if overlap.exists():
            raise serializers.ValidationError("Risorsa già prenotata in questo intervallo")
        return data


