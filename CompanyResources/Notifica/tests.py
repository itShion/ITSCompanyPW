from rest_framework import status
from rest_framework.test import APITestCase

from CompanyResources.Notifica.models import Notifica
from CompanyResources.Notifica.services import NotificaService
from CompanyResources.Prenotazione.tests import crea_utente


class NotificaEndpointsTests(APITestCase):
    def setUp(self):
        self.utente = crea_utente('mario')
        self.altro_utente = crea_utente('luigi')

        NotificaService.crea_notifica(
            utente=self.utente, titolo='Letta', messaggio='msg', tipo='BOOKING_APPROVED'
        )
        NotificaService.crea_notifica(
            utente=self.utente, titolo='Non letta', messaggio='msg', tipo='BOOKING_REJECTED'
        )
        # notifica di un altro utente: non deve mai comparire nelle risposte di 'mario'
        NotificaService.crea_notifica(
            utente=self.altro_utente, titolo='Di luigi', messaggio='msg', tipo='BOOKING_APPROVED'
        )

        Notifica.objects.filter(utente=self.utente, titolo='Letta').update(letta=True)

    def test_list_richiede_autenticazione(self):
        response = self.client.get('/api/notifiche/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_ritorna_solo_le_notifiche_dell_utente(self):
        self.client.force_authenticate(user=self.utente.user)
        response = self.client.get('/api/notifiche/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

    def test_unread_ritorna_solo_le_non_lette(self):
        self.client.force_authenticate(user=self.utente.user)
        response = self.client.get('/api/notifiche/unread/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['titolo'], 'Non letta')

    def test_mark_read_segna_come_letta(self):
        self.client.force_authenticate(user=self.utente.user)
        notifica = Notifica.objects.get(utente=self.utente, titolo='Non letta')

        response = self.client.post(f'/api/notifiche/{notifica.pk}/mark_read/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        notifica.refresh_from_db()
        self.assertTrue(notifica.letta)

    def test_mark_read_non_permette_di_segnare_notifiche_altrui(self):
        self.client.force_authenticate(user=self.altro_utente.user)
        notifica_di_mario = Notifica.objects.get(utente=self.utente, titolo='Non letta')

        response = self.client.post(f'/api/notifiche/{notifica_di_mario.pk}/mark_read/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        notifica_di_mario.refresh_from_db()
        self.assertFalse(notifica_di_mario.letta)
