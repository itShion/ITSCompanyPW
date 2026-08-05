from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APITestCase

from CompanyResources.ActivityLog.models import ActivityLog
from CompanyResources.Notifica.models import Notifica
from CompanyResources.Prenotazione.models import Prenotazione
from CompanyResources.Prenotazione.tests import crea_risorsa, crea_utente, slot


class PrenotazioneCreazioneTests(APITestCase):
    def setUp(self):
        self.utente = crea_utente('mario')

    def test_creazione_su_risorsa_capacita_1_si_auto_conferma(self):
        risorsa = crea_risorsa(capacita=1)
        inizio, fine = slot()
        self.client.force_authenticate(user=self.utente.user)

        response = self.client.post('/api/v1/prenotazioni/', {
            'risorsa_id': risorsa.pk,
            'data_inizio': inizio.isoformat(),
            'data_fine': fine.isoformat(),
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['stato'], 'CONFERMATA')

        prenotazione = Prenotazione.objects.get(pk=response.data['id'])
        self.assertTrue(
            ActivityLog.objects.filter(prenotazione=prenotazione, azione='CREATA').exists()
        )

    def test_creazione_su_risorsa_condivisa_resta_pending_e_invita_partecipanti(self):
        risorsa = crea_risorsa(capacita=4)
        invitato = crea_utente('invitato')
        inizio, fine = slot()
        self.client.force_authenticate(user=self.utente.user)

        response = self.client.post('/api/v1/prenotazioni/', {
            'risorsa_id': risorsa.pk,
            'data_inizio': inizio.isoformat(),
            'data_fine': fine.isoformat(),
            'partecipanti_ids': [invitato.pk],
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['stato'], 'PENDING')

        self.assertTrue(
            Notifica.objects.filter(utente=invitato, tipo='BOOKING_PENDING').exists()
        )

    def test_creazione_oltre_la_capienza_viene_rifiutata(self):
        risorsa = crea_risorsa(capacita=2)
        invitato1 = crea_utente('invitato1')
        invitato2 = crea_utente('invitato2')
        inizio, fine = slot()
        self.client.force_authenticate(user=self.utente.user)

        response = self.client.post('/api/v1/prenotazioni/', {
            'risorsa_id': risorsa.pk,
            'data_inizio': inizio.isoformat(),
            'data_fine': fine.isoformat(),
            'partecipanti_ids': [invitato1.pk, invitato2.pk],
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AuthFlowTests(APITestCase):
    def test_register_crea_utente_e_ritorna_token(self):
        response = self.client.post('/api/register/', {
            'username': 'nuovo',
            'email': 'nuovo@example.com',
            'password': 'passwordsicura123',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['ruolo'], 'UTENTE')

    def test_register_username_duplicato(self):
        crea_utente('esistente')
        response = self.client.post('/api/register/', {
            'username': 'esistente',
            'email': 'altro@example.com',
            'password': 'passwordsicura123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_credenziali_valide(self):
        crea_utente('mario')
        response = self.client.post('/api/token/', {'username': 'mario', 'password': 'test12345'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_credenziali_non_valide(self):
        crea_utente('mario')
        response = self.client.post('/api/token/', {'username': 'mario', 'password': 'sbagliata'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_richiede_autenticazione(self):
        response = self.client.get('/api/current-user/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_con_utente_autenticato(self):
        utente = crea_utente('mario')
        self.client.force_authenticate(user=utente.user)
        response = self.client.get('/api/current-user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'mario')


class PrenotazioneApprovazionePermessiTests(APITestCase):
    def setUp(self):
        self.risorsa = crea_risorsa(capacita=4)
        self.creatore = crea_utente('creatore')
        self.responsabile = crea_utente('capo', ruolo='RESPONSABILE')
        self.altro_utente = crea_utente('collega')

        inizio, fine = slot()
        self.prenotazione = Prenotazione.objects.create(
            utente=self.creatore, risorsa=self.risorsa,
            data_inizio=inizio, data_fine=fine, stato='PENDING'
        )

    def test_utente_normale_non_puo_approvare(self):
        self.client.force_authenticate(user=self.altro_utente.user)
        response = self.client.post(f'/api/v1/prenotazioni/{self.prenotazione.pk}/approva/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_utente_normale_non_vede_i_pending(self):
        self.client.force_authenticate(user=self.altro_utente.user)
        response = self.client.get('/api/v1/prenotazioni/pending/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_responsabile_puo_approvare_e_notifica_il_richiedente(self):
        self.client.force_authenticate(user=self.responsabile.user)
        response = self.client.post(f'/api/v1/prenotazioni/{self.prenotazione.pk}/approva/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.prenotazione.refresh_from_db()
        self.assertEqual(self.prenotazione.stato, 'CONFERMATA')

        # Esattamente una: Prenotazione/signals.py la crea gia' via post_save,
        # approva() non deve duplicarla.
        self.assertEqual(
            Notifica.objects.filter(utente=self.creatore, tipo='BOOKING_APPROVED').count(), 1
        )

    def test_responsabile_puo_rifiutare_e_notifica_il_richiedente(self):
        self.client.force_authenticate(user=self.responsabile.user)
        response = self.client.post(f'/api/v1/prenotazioni/{self.prenotazione.pk}/rifiuta/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.prenotazione.refresh_from_db()
        self.assertEqual(self.prenotazione.stato, 'ANNULLATA')

        self.assertEqual(
            Notifica.objects.filter(utente=self.creatore, tipo='BOOKING_REJECTED').count(), 1
        )


class RisorsaAzioniPermessiTests(APITestCase):
    def setUp(self):
        self.risorsa = crea_risorsa()
        self.utente = crea_utente('dipendente')
        self.responsabile = crea_utente('capo', ruolo='RESPONSABILE')

    def test_utente_normale_non_puo_disattivare_risorsa(self):
        self.client.force_authenticate(user=self.utente.user)
        response = self.client.post(f'/api/v1/risorse/{self.risorsa.pk}/disattiva/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_responsabile_puo_disattivare_risorsa(self):
        self.client.force_authenticate(user=self.responsabile.user)
        response = self.client.post(f'/api/v1/risorse/{self.risorsa.pk}/disattiva/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.risorsa.refresh_from_db()
        self.assertEqual(self.risorsa.stato, 'DISATTIVA')

        self.assertTrue(
            ActivityLog.objects.filter(
                utente=self.responsabile, azione='RISORSA_DISATTIVATA'
            ).exists()
        )


class UtenteRiabilitaPermessiTests(APITestCase):
    def setUp(self):
        self.disabilitato = crea_utente('disabilitato')
        self.disabilitato.user.is_active = False
        self.disabilitato.user.save()

        self.utente = crea_utente('dipendente')
        self.admin = crea_utente('admin', ruolo='ADMIN')

    def test_utente_normale_non_puo_riabilitare(self):
        self.client.force_authenticate(user=self.utente.user)
        response = self.client.post(f'/api/v1/utenti/{self.disabilitato.pk}/riabilita/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_puo_riabilitare(self):
        self.client.force_authenticate(user=self.admin.user)
        response = self.client.post(f'/api/v1/utenti/{self.disabilitato.pk}/riabilita/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.disabilitato.user.refresh_from_db()
        self.assertTrue(self.disabilitato.user.is_active)

        self.assertTrue(
            ActivityLog.objects.filter(
                utente=self.admin, azione='UTENTE_RIABILITATO'
            ).exists()
        )

    def test_disabilitazione_utente_scrive_activity_log(self):
        self.client.force_authenticate(user=self.admin.user)
        response = self.client.delete(f'/api/v1/utenti/{self.utente.pk}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertTrue(
            ActivityLog.objects.filter(
                utente=self.admin, azione='UTENTE_DISABILITATO'
            ).exists()
        )


class UtenteCreazionePermessiTests(APITestCase):
    def setUp(self):
        self.admin = crea_utente('admin', ruolo='ADMIN')
        self.dipendente = crea_utente('dipendente')

    def test_utente_normale_non_puo_creare_utenti(self):
        self.client.force_authenticate(user=self.dipendente.user)
        response = self.client.post('/api/v1/utenti/', {
            'username': 'nuovo',
            'email': 'nuovo@example.com',
            'password': 'passwordsicura123',
            'ruolo': 'UTENTE',
            'telefono': '3331234567',
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_puo_creare_utenti_e_scrive_activity_log(self):
        self.client.force_authenticate(user=self.admin.user)
        response = self.client.post('/api/v1/utenti/', {
            'username': 'nuovo',
            'email': 'nuovo@example.com',
            'password': 'passwordsicura123',
            'ruolo': 'UTENTE',
            'telefono': '3331234567',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

        self.assertTrue(
            ActivityLog.objects.filter(
                utente=self.admin, azione='UTENTE_CREATO'
            ).exists()
        )


class ThrottlingTests(APITestCase):
    """Il throttle e' condiviso (per IP) tra tutte le richieste anonime del
    processo di test: puliamo la cache prima e dopo per non contaminare
    ne' essere contaminati da altri test che chiamano endpoint anonimi."""

    def setUp(self):
        cache.clear()

    def tearDown(self):
        cache.clear()

    def test_troppe_richieste_anonime_vengono_bloccate(self):
        # /api/token/ e' AllowAny: le richieste passano il controllo
        # permessi e arrivano al throttle anche con credenziali finte.
        for _ in range(100):
            response = self.client.post('/api/token/', {'username': 'nessuno', 'password': 'x'})
            self.assertNotEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

        response = self.client.post('/api/token/', {'username': 'nessuno', 'password': 'x'})
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
