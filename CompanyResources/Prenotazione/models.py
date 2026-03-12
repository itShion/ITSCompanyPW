from django.utils import timezone
from django.db import models
from django.core.exceptions import ValidationError
from datetime import date
from CompanyResources.Risorsa.models import Risorsa
from CompanyResources.Utente.models import Utente
from CompanyResources.Notifica.models import Notifica

# Create your models here.
class Prenotazione(models.Model):

    STATI = [
        ('PENDING', 'In attesa'),
        ('CONFERMATA', 'Confermata'),
        ('ANNULLATA', 'Annullata'),
    ]


    utente = models.ForeignKey(Utente,on_delete=models.CASCADE,related_name='prenotazioni')
    risorsa = models.ForeignKey(Risorsa,on_delete=models.CASCADE,related_name='prenotazione')

    data_inizio = models.DateTimeField()
    data_fine = models.DateTimeField()

    stato = models.CharField(max_length=10,choices=STATI,default='PENDING')
    motivo = models.TextField(default='')


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        db_table = 'Prenotazione'
        ordering = ['-data_inizio']
        indexes = [
            models.Index(fields=['risorsa', 'data_inizio', 'data_fine']),
            models.Index(fields=['stato', 'data_inizio']),
        ]
    # Validazione
    def clean(self):
        if self.data_fine <= self.data_inizio:
            raise ValidationError("La data fine deve essere successiva alla data inizio")

        if not self.risorsa.attiva:
            raise ValidationError(f"La risorsa {self.risorsa.nome} non è attiva")

        # Si prenota solo per 1 giorno.
        if self.data_inizio.date() != self.data_fine.date():
            raise ValidationError("Le prenotazioni devono iniziare e finire nello stesso giorno")

        if not self.risorsa.is_open_in(self.data_inizio.date()):
            raise ValidationError(f"La risorsa non è disponibile di {self.data_inizio.strftime('%A')}")

        if not self.risorsa.is_in_orari(self.data_inizio.time(), self.data_fine.time()):
            raise ValidationError(
                f"Orario non valido. La risorsa è accessibile dalle "
                f"{self.risorsa.orario_apertura.strftime('%H:%M')} alle "
                f"{self.risorsa.orario_chiusura.strftime('%H:%M')}"
            )

        durata_ore = (self.data_fine - self.data_inizio).total_seconds() / 3600
        DURATA_MAX_ORE = 8

        if durata_ore > DURATA_MAX_ORE:
            raise ValidationError(f"Durata massima: {DURATA_MAX_ORE} ore")

        DURATA_MIN_MINUTI = 30
        if durata_ore * 60 < DURATA_MIN_MINUTI:
            raise ValidationError(f"Durata minima: {DURATA_MIN_MINUTI} minuti")

        # Si prenota per o'clock o mezz'ora.
        if self.data_inizio.minute not in [0, 30] or self.data_inizio.second != 0:
            raise ValidationError("Le prenotazioni iniziano solo alle :00 o :30")

        # 9. Anticipo massimo: 30 giorni
        ANTICIPO_MAX_GIORNI = 30
        giorni_anticipo = (self.data_inizio.date() - date.today()).days

        if giorni_anticipo > ANTICIPO_MAX_GIORNI:
            raise ValidationError(
                f"Anticipo massimo: {ANTICIPO_MAX_GIORNI} giorni "
                f"(richiesti: {giorni_anticipo})"
            )

        # Non nel passato
        if self.data_inizio < timezone.now():
            raise ValidationError("Non puoi prenotare nel passato")

        # Sovrapposizioni
        conflitti = Prenotazione.objects.filter(
            risorsa=self.risorsa,  # Stessa risorsa
            data_inizio__lt=self.data_fine,  # Inizia prima che finisca la nuova
            data_fine__gt=self.data_inizio,  # Finisce dopo che inizia la nuova
            stato__in=['PENDING', 'CONFERMATA']  # Solo prenotazioni attive
        )

        # Se stiamo modificando una prenotazione esistente, escludiamola
        if self.pk:
            conflitti = conflitti.exclude(pk=self.pk)

        if conflitti.exists():
            # Mostra info sul conflitto
            conflitto = conflitti.first()
            raise ValidationError(
                f"Conflitto con prenotazione esistente: "
                f"{conflitto.utente.user.username} ha già prenotato "
                f"dalle {conflitto.data_inizio.strftime('%H:%M')} "
                f"alle {conflitto.data_fine.strftime('%H:%M')}"
            )

        # 12. LIMITE UTENTE: max 3 prenotazioni al giorno
        MAX_PRENOTAZIONI_GIORNO = 3
        prenotazioni_oggi = Prenotazione.objects.filter(
            utente=self.utente,
            data_inizio__date=self.data_inizio.date(),
            stato__in=['PENDING', 'CONFERMATA']
        )

        if self.pk:
            prenotazioni_oggi = prenotazioni_oggi.exclude(pk=self.pk)

        if prenotazioni_oggi.count() >= MAX_PRENOTAZIONI_GIORNO:
            raise ValidationError(
                f"Limite di {MAX_PRENOTAZIONI_GIORNO} prenotazioni al giorno raggiunto"
            )

    def save(self, *args, **kwargs):
        """Sempre validare prima di salvare"""
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def durata_ore(self):
        """Calcola durata in ore (property per comodità)"""
        if self.data_inizio and self.data_fine:
            return round((self.data_fine - self.data_inizio).total_seconds() / 3600, 2)
        return 0

    def crea_notifica_approvazione(self):
        from CompanyResources.Notifica.models import Notifica
        Notifica.objects.create(
            utente=self.utente,
            titolo="Prenotazione approvata",
            messaggio=f"La tua prenotazione per {self.risorsa.nome} è stata approvata.",
            tipo="BOOKING_APPROVED"
        )
    
