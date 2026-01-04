from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Utente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ruolo = models.CharField(max_length=120)
    telefono = models.CharField(max_length=10)

    class Meta:
        db_table = 'Utente'