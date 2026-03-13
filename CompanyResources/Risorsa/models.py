from django.db import models
from datetime import time


class TipoRisorsa(models.Model):
    nome = models.CharField(max_length=100)
    descrizione = models.CharField(max_length=100)
    immagine_url = models.CharField(max_length=500, default="")

    def __str__(self):
        return f"{self.nome} (id: {self.pk})"

    class Meta:
        db_table = 'TipoRisorsa'


class Risorsa(models.Model):
    STATI = [
        ('ATTIVA', 'Attiva'),
        ('MANUTENZIONE', 'In manutenzione'),
        ('DISATTIVA', 'Disattiva'),
    ]

    nome = models.CharField(max_length=120)
    descrizione = models.CharField(max_length=200)
    capacita = models.IntegerField(default=1)

    orario_apertura = models.TimeField(default=time(8, 0))
    orario_chiusura = models.TimeField(default=time(18, 0))

    lunedi = models.BooleanField(default=True)
    martedi = models.BooleanField(default=True)
    mercoledi = models.BooleanField(default=True)
    giovedi = models.BooleanField(default=True)
    venerdi = models.BooleanField(default=True)
    sabato = models.BooleanField(default=False)
    domenica = models.BooleanField(default=False)

    stato = models.CharField(max_length=20, choices=STATI, default='ATTIVA')

    tipo = models.ForeignKey(
        TipoRisorsa,
        on_delete=models.CASCADE,
        related_name='risorse'
    )

    def __str__(self):
        return f"{self.nome} (id: {self.pk})"

    class Meta:
        db_table = 'Risorsa'

    def is_open_in(self, data):
        giorni = {
            0: self.lunedi,
            1: self.martedi,
            2: self.mercoledi,
            3: self.giovedi,
            4: self.venerdi,
            5: self.sabato,
            6: self.domenica,
        }
        return giorni.get(data.weekday(), False)

    def is_in_orari(self, ora_inizio, ora_fine):
        return ora_inizio >= self.orario_apertura and ora_fine <= self.orario_chiusura

    @property
    def attiva(self):
        return self.stato == 'ATTIVA'