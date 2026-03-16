from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Utente(models.Model):

    RUOLI = [
        ('DIPENDENTE', 'dipendente'),
        ('RESPONSABILE', 'responsabile'),
        ('ADMIN', 'amministratore'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ruolo = models.CharField(max_length=120, choices=RUOLI)
    telefono = models.CharField(max_length=10)

    class Meta:
        db_table = 'Utente'

    def __str__(self):
        return f"{self.user.username} - {self.get_ruolo_display()}"

    def is_utente(self):
        return self.ruolo == 'DIPENDENTE'

    def is_responsabile(self):
        return self.ruolo == 'RESPONSABILE'

    def is_admin(self):
        return self.ruolo == 'ADMIN' or self.user.is_superuser
    def notifiche_non_lette(self):
        return self.notifiche.filter(letta=False).count()
