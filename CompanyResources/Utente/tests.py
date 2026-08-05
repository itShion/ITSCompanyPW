from django.contrib.auth.models import User
from django.test import TestCase

from CompanyResources.Notifica.services import NotificaService
from CompanyResources.Utente.models import Utente


class UtenteRuoloTests(TestCase):
    def _crea(self, ruolo, is_superuser=False):
        user = User.objects.create_user(
            username=f'user_{ruolo}_{is_superuser}', password='x', is_superuser=is_superuser
        )
        return Utente.objects.create(user=user, ruolo=ruolo, telefono='')

    def test_is_utente(self):
        utente = self._crea('UTENTE')
        self.assertTrue(utente.is_utente())
        self.assertFalse(utente.is_responsabile())
        self.assertFalse(utente.is_admin())

    def test_is_responsabile(self):
        utente = self._crea('RESPONSABILE')
        self.assertTrue(utente.is_responsabile())
        self.assertFalse(utente.is_admin())

    def test_is_admin_per_ruolo(self):
        utente = self._crea('ADMIN')
        self.assertTrue(utente.is_admin())

    def test_is_admin_per_superuser_anche_con_ruolo_utente(self):
        utente = self._crea('UTENTE', is_superuser=True)
        self.assertTrue(utente.is_admin())

    def test_notifiche_non_lette(self):
        utente = self._crea('UTENTE')
        self.assertEqual(utente.notifiche_non_lette(), 0)

        NotificaService.crea_notifica(utente=utente, titolo='t', messaggio='m', tipo='BOOKING_APPROVED')
        NotificaService.crea_notifica(utente=utente, titolo='t2', messaggio='m2', tipo='BOOKING_REJECTED')
        self.assertEqual(utente.notifiche_non_lette(), 2)

        utente.notifiche.first().delete()
        self.assertEqual(utente.notifiche_non_lette(), 1)
