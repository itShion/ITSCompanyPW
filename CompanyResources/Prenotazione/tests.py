from datetime import timedelta

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone

from CompanyResources.Prenotazione.models import Prenotazione
from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa
from CompanyResources.Utente.models import Utente


def slot(giorni_avanti=1, ora=10, minuti=0, durata_minuti=60):
    inizio = (timezone.now() + timedelta(days=giorni_avanti)).replace(
        hour=ora, minute=minuti, second=0, microsecond=0
    )
    return inizio, inizio + timedelta(minutes=durata_minuti)


def crea_utente(username, ruolo='UTENTE'):
    user = User.objects.create_user(username=username, password='test12345')
    return Utente.objects.create(user=user, ruolo=ruolo, telefono='')


def crea_risorsa(capacita=1, tutti_i_giorni=True, **kwargs):
    tipo = TipoRisorsa.objects.create(nome='Sala', descrizione='desc')
    defaults = dict(
        nome='Sala Test',
        descrizione='desc',
        capacita=capacita,
        tipo=tipo,
    )
    if tutti_i_giorni:
        for giorno in ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica']:
            defaults[giorno] = True
    defaults.update(kwargs)
    return Risorsa.objects.create(**defaults)


class PrenotazioneValidationTests(TestCase):
    def setUp(self):
        self.utente = crea_utente('mario')
        self.risorsa = crea_risorsa()

    def test_prenotazione_valida_viene_salvata(self):
        inizio, fine = slot()
        p = Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)
        self.assertIsNotNone(p.pk)

    def test_data_fine_prima_di_data_inizio(self):
        inizio, fine = slot()
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=fine, data_fine=inizio)

    def test_risorsa_non_attiva(self):
        self.risorsa.stato = 'MANUTENZIONE'
        self.risorsa.save()
        inizio, fine = slot()
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_giorni_diversi_non_ammessi(self):
        inizio, _ = slot()
        fine = inizio + timedelta(days=1)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_risorsa_chiusa_quel_giorno(self):
        risorsa_chiusa = crea_risorsa(tutti_i_giorni=False, lunedi=False, martedi=False, mercoledi=False,
                                       giovedi=False, venerdi=False, sabato=False, domenica=False)
        inizio, fine = slot()
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=risorsa_chiusa, data_inizio=inizio, data_fine=fine)

    def test_fuori_orario_apertura(self):
        inizio, fine = slot(ora=6)  # la risorsa apre di default alle 8:00
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_durata_massima_superata(self):
        inizio, fine = slot(ora=8, durata_minuti=9 * 60)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_durata_minima_non_raggiunta(self):
        inizio, fine = slot(durata_minuti=15)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_orario_inizio_non_in_punto_o_mezzora(self):
        inizio, fine = slot(minuti=15)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_anticipo_massimo_superato(self):
        inizio, fine = slot(giorni_avanti=31)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_non_si_puo_prenotare_nel_passato(self):
        inizio, fine = slot(giorni_avanti=-1)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_conflitto_con_prenotazione_esistente(self):
        inizio, fine = slot(ora=9, durata_minuti=60)
        Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

        altro_utente = crea_utente('luigi')
        inizio_sovrapposto = inizio + timedelta(minutes=30)
        fine_sovrapposta = fine + timedelta(minutes=30)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(
                utente=altro_utente, risorsa=self.risorsa,
                data_inizio=inizio_sovrapposto, data_fine=fine_sovrapposta
            )

    def test_nessun_conflitto_se_prenotazioni_consecutive(self):
        inizio, fine = slot(ora=9, durata_minuti=60)
        Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

        # Inizia esattamente quando finisce la prima: non e' un conflitto
        p2 = Prenotazione.objects.create(
            utente=self.utente, risorsa=self.risorsa,
            data_inizio=fine, data_fine=fine + timedelta(minutes=60)
        )
        self.assertIsNotNone(p2.pk)

    def test_limite_prenotazioni_giornaliere(self):
        for ora in (8, 9, 10):
            inizio, fine = slot(ora=ora, durata_minuti=30)
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

        inizio, fine = slot(ora=11, durata_minuti=30)
        with self.assertRaises(ValidationError):
            Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)

    def test_durata_ore_property(self):
        inizio, fine = slot(durata_minuti=90)
        p = Prenotazione.objects.create(utente=self.utente, risorsa=self.risorsa, data_inizio=inizio, data_fine=fine)
        self.assertEqual(p.durata_ore, 1.5)
