from django.db import models
from CompanyResources.Utente.models import Utente


class Notifica(models.Model):

    TIPI = [
        ("BOOKING_PENDING", "Richiesta in attesa"),
        ("BOOKING_APPROVED", "Prenotazione approvata"),
        ("BOOKING_REJECTED", "Prenotazione rifiutata"),
    ]

    utente = models.ForeignKey(
        Utente,
        on_delete=models.CASCADE,
        related_name="notifiche"
    )

    titolo = models.CharField(max_length=255)
    messaggio = models.TextField()
    tipo = models.CharField(max_length=50, choices=TIPI)

    letta = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Notifica"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["utente", "letta"]),
        ]

    def __str__(self):
        return f"{self.utente.user.username} - {self.titolo}"