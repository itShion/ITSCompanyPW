from datetime import date, time

from django.test import TestCase

from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa


class RisorsaOrariTests(TestCase):
    def setUp(self):
        tipo = TipoRisorsa.objects.create(nome='Sala', descrizione='desc')
        self.risorsa = Risorsa.objects.create(
            nome='Sala Test', descrizione='desc', capacita=1, tipo=tipo,
            orario_apertura=time(9, 0), orario_chiusura=time(17, 0),
            lunedi=True, martedi=False, mercoledi=False, giovedi=False,
            venerdi=False, sabato=False, domenica=False,
        )

    def test_is_open_in_giorno_aperto(self):
        # 2024-01-01 e' un lunedi
        self.assertTrue(self.risorsa.is_open_in(date(2024, 1, 1)))

    def test_is_open_in_giorno_chiuso(self):
        # 2024-01-02 e' un martedi
        self.assertFalse(self.risorsa.is_open_in(date(2024, 1, 2)))

    def test_is_in_orari_dentro_la_fascia(self):
        self.assertTrue(self.risorsa.is_in_orari(time(9, 0), time(17, 0)))
        self.assertTrue(self.risorsa.is_in_orari(time(10, 0), time(11, 0)))

    def test_is_in_orari_fuori_dalla_fascia(self):
        self.assertFalse(self.risorsa.is_in_orari(time(8, 0), time(10, 0)))
        self.assertFalse(self.risorsa.is_in_orari(time(16, 0), time(18, 0)))

    def test_attiva_property(self):
        self.assertTrue(self.risorsa.attiva)
        self.risorsa.stato = 'MANUTENZIONE'
        self.assertFalse(self.risorsa.attiva)
        self.risorsa.stato = 'DISATTIVA'
        self.assertFalse(self.risorsa.attiva)
