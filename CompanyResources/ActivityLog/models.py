from django.db import models
from CompanyResources.Utente.models import Utente
from CompanyResources.Prenotazione.models import Prenotazione


class ActivityLog(models.Model):
    AZIONI = [
        ('CREATA', 'Prenotazione creata'),
        ('CONFERMATA', 'Prenotazione confermata'),
        ('ANNULLATA', 'Prenotazione annullata'),
        ('RIFIUTATA', 'Prenotazione rifiutata'),
        ('PARTECIPANTE_RIFIUTATO', 'Partecipante ha rifiutato'),
        ('PARTECIPANTE_ACCETTATO', 'Partecipante ha accettato'),
    ]

    azione = models.CharField(max_length=30, choices=AZIONI)
    utente = models.ForeignKey(
        Utente,
        on_delete=models.SET_NULL,
        null=True,
        related_name='activity_logs'
    )
    prenotazione = models.ForeignKey(
        Prenotazione,
        on_delete=models.SET_NULL,
        null=True,
        related_name='activity_logs'
    )
    descrizione = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ActivityLog'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.created_at.strftime('%H:%M')} - {self.azione} - {self.descrizione}"