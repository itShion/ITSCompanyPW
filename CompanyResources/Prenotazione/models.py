from django.db import models

from CompanyResources.Risorsa.models import Risorsa
from CompanyResources.Utente.models import Utente


# Create your models here.
class Prenotazione(models.Model):
    utente = models.ForeignKey(
        Utente,
        on_delete=models.CASCADE,
        related_name='prenotazioni'
    )

    risorsa = models.ForeignKey(
        Risorsa,
        on_delete=models.CASCADE,
        related_name='prenotazione'
    )

    data_inizio = models.DateTimeField()
    data_fine = models.DateTimeField()

    stato = models.CharField(
        max_length=10,
        choices=[('TRUE', 'True'), ('FALSE', 'False')],
        default='True'
    )

    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        db_table = 'Prenotazione'