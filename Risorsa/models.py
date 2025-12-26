from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Risorsa(models.Model):
    nome = models.CharField(max_length=120)
    descrizione = models.CharField(max_length=200)
    is_available = models.BooleanField()
    capacita = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.nome} (id: {self.pk})"

    class Meta:
        db_table = 'Risorsa'

class TipoRisorsa(models.Model):
    nome = models.CharField(max_length=100)
    descrizione = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.nome} (id: {self.pk})"

    class Meta:
        db_table = 'TipoRisorsa'