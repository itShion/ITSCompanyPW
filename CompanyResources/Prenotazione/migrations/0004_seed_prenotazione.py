from django.db import migrations
from datetime import datetime


def seed_prenotazioni(apps, schema_editor):
    Prenotazione = apps.get_model('Prenotazione', 'Prenotazione')
    PrenotazionePartecipante = apps.get_model('Prenotazione', 'PrenotazionePartecipante')
    Utente = apps.get_model('Utente', 'Utente')
    Risorsa = apps.get_model('Risorsa', 'Risorsa')

    utenti = {u.pk: u for u in Utente.objects.all()}
    risorse = {r.pk: r for r in Risorsa.objects.all()}

    if not utenti or not risorse:
        return

    # ─── PRENOTAZIONI FUTURE (pk 1-6) ────────────────────────────────────────
    Prenotazione.objects.bulk_create([
        Prenotazione(pk=1, utente=utenti[8], risorsa=risorse[15],
            data_inizio=datetime(2026,3,17,8,0), data_fine=datetime(2026,3,17,16,0),
            stato='PENDING', motivo='Meeting con IT Agency per chiudere Q2',
            created_at=datetime(2026,3,16,22,32,38), updated_at=datetime(2026,3,16,22,32,38)),
        Prenotazione(pk=2, utente=utenti[8], risorsa=risorse[3],
            data_inizio=datetime(2026,3,17,8,0), data_fine=datetime(2026,3,17,8,30),
            stato='PENDING', motivo='Riunione di Riallineamento',
            created_at=datetime(2026,3,16,22,37,41), updated_at=datetime(2026,3,16,22,37,41)),
        Prenotazione(pk=3, utente=utenti[8], risorsa=risorse[4],
            data_inizio=datetime(2026,3,17,8,0), data_fine=datetime(2026,3,17,8,30),
            stato='CONFERMATA', motivo='Coding',
            created_at=datetime(2026,3,16,22,38,36), updated_at=datetime(2026,3,16,22,38,36)),
        Prenotazione(pk=4, utente=utenti[2], risorsa=risorse[1],
            data_inizio=datetime(2026,3,17,12,0), data_fine=datetime(2026,3,17,14,0),
            stato='PENDING', motivo='Riunione settimanale del team di sviluppo',
            created_at=datetime(2026,3,16,22,43,41), updated_at=datetime(2026,3,16,22,43,41)),
        Prenotazione(pk=5, utente=utenti[6], risorsa=risorse[4],
            data_inizio=datetime(2026,3,19,8,0), data_fine=datetime(2026,3,19,10,0),
            stato='CONFERMATA', motivo='Lavoro individuale su progetto aziendale',
            created_at=datetime(2026,3,16,22,45,48), updated_at=datetime(2026,3,16,22,45,48)),
        Prenotazione(pk=6, utente=utenti[6], risorsa=risorse[14],
            data_inizio=datetime(2026,3,20,15,0), data_fine=datetime(2026,3,20,16,0),
            stato='PENDING', motivo='Corso di aggiornamento tecnico per il reparto IT',
            created_at=datetime(2026,3,16,22,47,4), updated_at=datetime(2026,3,16,22,47,4)),
    ])

    # ─── PRENOTAZIONI STORICHE (pk 100-119) ──────────────────────────────────
    Prenotazione.objects.bulk_create([
        Prenotazione(pk=100, utente=utenti[8], risorsa=risorse[4],
            data_inizio=datetime(2026,2,3,9,0), data_fine=datetime(2026,2,3,11,0),
            stato='CONFERMATA', motivo='Lavoro individuale progetto Q1',
            created_at=datetime(2026,2,2,10,0), updated_at=datetime(2026,2,2,10,0)),
        Prenotazione(pk=101, utente=utenti[6], risorsa=risorse[5],
            data_inizio=datetime(2026,2,4,10,0), data_fine=datetime(2026,2,4,12,0),
            stato='CONFERMATA', motivo='Analisi dati mensili',
            created_at=datetime(2026,2,3,9,0), updated_at=datetime(2026,2,3,9,0)),
        Prenotazione(pk=102, utente=utenti[2], risorsa=risorse[1],
            data_inizio=datetime(2026,2,5,14,0), data_fine=datetime(2026,2,5,16,0),
            stato='CONFERMATA', motivo='Review sprint febbraio',
            created_at=datetime(2026,2,4,8,0), updated_at=datetime(2026,2,4,8,0)),
        Prenotazione(pk=103, utente=utenti[4], risorsa=risorse[6],
            data_inizio=datetime(2026,2,6,8,0), data_fine=datetime(2026,2,6,10,0),
            stato='CONFERMATA', motivo='Sviluppo modulo pagamenti',
            created_at=datetime(2026,2,5,17,0), updated_at=datetime(2026,2,5,17,0)),
        Prenotazione(pk=104, utente=utenti[5], risorsa=risorse[4],
            data_inizio=datetime(2026,2,10,9,0), data_fine=datetime(2026,2,10,11,0),
            stato='ANNULLATA', motivo='Lavoro da remoto',
            created_at=datetime(2026,2,8,9,0), updated_at=datetime(2026,2,9,14,0)),
        Prenotazione(pk=105, utente=utenti[3], risorsa=risorse[3],
            data_inizio=datetime(2026,2,11,10,0), data_fine=datetime(2026,2,11,12,0),
            stato='CONFERMATA', motivo='Workshop UX design',
            created_at=datetime(2026,2,10,9,0), updated_at=datetime(2026,2,10,9,0)),
        Prenotazione(pk=106, utente=utenti[7], risorsa=risorse[15],
            data_inizio=datetime(2026,2,12,8,0), data_fine=datetime(2026,2,12,16,0),
            stato='CONFERMATA', motivo='Trasferta cliente Milano',
            created_at=datetime(2026,2,11,10,0), updated_at=datetime(2026,2,11,10,0)),
        Prenotazione(pk=107, utente=utenti[8], risorsa=risorse[1],
            data_inizio=datetime(2026,2,13,9,0), data_fine=datetime(2026,2,13,11,0),
            stato='ANNULLATA', motivo='Riunione cliente annullata',
            created_at=datetime(2026,2,12,8,0), updated_at=datetime(2026,2,13,7,0)),
        Prenotazione(pk=108, utente=utenti[2], risorsa=risorse[15],
            data_inizio=datetime(2026,2,17,8,0), data_fine=datetime(2026,2,17,14,0),
            stato='CONFERMATA', motivo='Meeting partner commerciale',
            created_at=datetime(2026,2,16,9,0), updated_at=datetime(2026,2,16,9,0)),
        Prenotazione(pk=109, utente=utenti[6], risorsa=risorse[14],
            data_inizio=datetime(2026,2,20,15,0), data_fine=datetime(2026,2,20,16,0),
            stato='CONFERMATA', motivo='Corso sicurezza informatica',
            created_at=datetime(2026,2,19,10,0), updated_at=datetime(2026,2,19,10,0)),
        Prenotazione(pk=110, utente=utenti[4], risorsa=risorse[5],
            data_inizio=datetime(2026,3,2,9,0), data_fine=datetime(2026,3,2,11,0),
            stato='CONFERMATA', motivo='Sviluppo API REST',
            created_at=datetime(2026,3,1,10,0), updated_at=datetime(2026,3,1,10,0)),
        Prenotazione(pk=111, utente=utenti[5], risorsa=risorse[3],
            data_inizio=datetime(2026,3,3,10,0), data_fine=datetime(2026,3,3,12,0),
            stato='CONFERMATA', motivo='Presentazione Q1 risultati',
            created_at=datetime(2026,3,2,9,0), updated_at=datetime(2026,3,2,9,0)),
        Prenotazione(pk=112, utente=utenti[8], risorsa=risorse[6],
            data_inizio=datetime(2026,3,4,14,0), data_fine=datetime(2026,3,4,16,0),
            stato='ANNULLATA', motivo='Impegno improvviso',
            created_at=datetime(2026,3,3,8,0), updated_at=datetime(2026,3,4,9,0)),
        Prenotazione(pk=113, utente=utenti[3], risorsa=risorse[1],
            data_inizio=datetime(2026,3,5,9,0), data_fine=datetime(2026,3,5,11,0),
            stato='CONFERMATA', motivo='Design review con il team',
            created_at=datetime(2026,3,4,16,0), updated_at=datetime(2026,3,4,16,0)),
        Prenotazione(pk=114, utente=utenti[7], risorsa=risorse[4],
            data_inizio=datetime(2026,3,6,8,0), data_fine=datetime(2026,3,6,10,0),
            stato='CONFERMATA', motivo='Test ambiente staging',
            created_at=datetime(2026,3,5,9,0), updated_at=datetime(2026,3,5,9,0)),
        Prenotazione(pk=115, utente=utenti[2], risorsa=risorse[15],
            data_inizio=datetime(2026,3,10,8,0), data_fine=datetime(2026,3,10,16,0),
            stato='CONFERMATA', motivo='Visita cliente Torino',
            created_at=datetime(2026,3,9,10,0), updated_at=datetime(2026,3,9,10,0)),
        Prenotazione(pk=116, utente=utenti[6], risorsa=risorse[5],
            data_inizio=datetime(2026,3,11,9,0), data_fine=datetime(2026,3,11,11,0),
            stato='CONFERMATA', motivo='Aggiornamento documentazione',
            created_at=datetime(2026,3,10,14,0), updated_at=datetime(2026,3,10,14,0)),
        Prenotazione(pk=117, utente=utenti[4], risorsa=risorse[13],
            data_inizio=datetime(2026,3,11,9,0), data_fine=datetime(2026,3,11,13,0),
            stato='CONFERMATA', motivo='Corso Django avanzato',
            created_at=datetime(2026,3,10,9,0), updated_at=datetime(2026,3,10,9,0)),
        Prenotazione(pk=118, utente=utenti[8], risorsa=risorse[4],
            data_inizio=datetime(2026,3,12,10,0), data_fine=datetime(2026,3,12,12,0),
            stato='ANNULLATA', motivo='Lavoro in smart working',
            created_at=datetime(2026,3,11,9,0), updated_at=datetime(2026,3,12,8,0)),
        Prenotazione(pk=119, utente=utenti[5], risorsa=risorse[1],
            data_inizio=datetime(2026,3,13,14,0), data_fine=datetime(2026,3,13,16,0),
            stato='CONFERMATA', motivo='Retrospettiva sprint marzo',
            created_at=datetime(2026,3,12,10,0), updated_at=datetime(2026,3,12,10,0)),
    ])

    # ─── PARTECIPANTI FUTURE (pk 1-16) ───────────────────────────────────────
    PrenotazionePartecipante.objects.bulk_create([
        PrenotazionePartecipante(pk=1,  prenotazione_id=1, utente=utenti[8], stato='ACCETTATO', created_at=datetime(2026,3,16,22,32,38)),
        PrenotazionePartecipante(pk=2,  prenotazione_id=1, utente=utenti[5], stato='INVITATO',  created_at=datetime(2026,3,16,22,32,38)),
        PrenotazionePartecipante(pk=3,  prenotazione_id=1, utente=utenti[6], stato='INVITATO',  created_at=datetime(2026,3,16,22,32,38)),
        PrenotazionePartecipante(pk=4,  prenotazione_id=2, utente=utenti[8], stato='ACCETTATO', created_at=datetime(2026,3,16,22,37,41)),
        PrenotazionePartecipante(pk=5,  prenotazione_id=2, utente=utenti[2], stato='INVITATO',  created_at=datetime(2026,3,16,22,37,41)),
        PrenotazionePartecipante(pk=6,  prenotazione_id=2, utente=utenti[6], stato='INVITATO',  created_at=datetime(2026,3,16,22,37,41)),
        PrenotazionePartecipante(pk=7,  prenotazione_id=2, utente=utenti[4], stato='INVITATO',  created_at=datetime(2026,3,16,22,37,41)),
        PrenotazionePartecipante(pk=8,  prenotazione_id=4, utente=utenti[2], stato='ACCETTATO', created_at=datetime(2026,3,16,22,43,41)),
        PrenotazionePartecipante(pk=9,  prenotazione_id=4, utente=utenti[4], stato='INVITATO',  created_at=datetime(2026,3,16,22,43,41)),
        PrenotazionePartecipante(pk=10, prenotazione_id=4, utente=utenti[3], stato='INVITATO',  created_at=datetime(2026,3,16,22,43,41)),
        PrenotazionePartecipante(pk=11, prenotazione_id=4, utente=utenti[7], stato='INVITATO',  created_at=datetime(2026,3,16,22,43,41)),
        PrenotazionePartecipante(pk=12, prenotazione_id=4, utente=utenti[8], stato='INVITATO',  created_at=datetime(2026,3,16,22,43,41)),
        PrenotazionePartecipante(pk=13, prenotazione_id=6, utente=utenti[6], stato='ACCETTATO', created_at=datetime(2026,3,16,22,47,4)),
        PrenotazionePartecipante(pk=14, prenotazione_id=6, utente=utenti[4], stato='INVITATO',  created_at=datetime(2026,3,16,22,47,4)),
        PrenotazionePartecipante(pk=15, prenotazione_id=6, utente=utenti[5], stato='INVITATO',  created_at=datetime(2026,3,16,22,47,4)),
        PrenotazionePartecipante(pk=16, prenotazione_id=6, utente=utenti[2], stato='INVITATO',  created_at=datetime(2026,3,16,22,47,4)),
    ])

    # ─── PARTECIPANTI STORICI (pk 100-130) ───────────────────────────────────
    PrenotazionePartecipante.objects.bulk_create([
        PrenotazionePartecipante(pk=100, prenotazione_id=102, utente=utenti[2], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=101, prenotazione_id=102, utente=utenti[3], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=102, prenotazione_id=102, utente=utenti[4], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=103, prenotazione_id=102, utente=utenti[5], stato='RIFIUTATO'),
        PrenotazionePartecipante(pk=104, prenotazione_id=105, utente=utenti[3], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=105, prenotazione_id=105, utente=utenti[6], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=106, prenotazione_id=105, utente=utenti[7], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=107, prenotazione_id=106, utente=utenti[7], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=108, prenotazione_id=106, utente=utenti[8], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=109, prenotazione_id=107, utente=utenti[8], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=110, prenotazione_id=107, utente=utenti[2], stato='INVITATO'),
        PrenotazionePartecipante(pk=111, prenotazione_id=108, utente=utenti[2], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=112, prenotazione_id=108, utente=utenti[4], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=113, prenotazione_id=109, utente=utenti[6], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=114, prenotazione_id=109, utente=utenti[3], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=115, prenotazione_id=109, utente=utenti[5], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=116, prenotazione_id=111, utente=utenti[5], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=117, prenotazione_id=111, utente=utenti[2], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=118, prenotazione_id=111, utente=utenti[7], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=119, prenotazione_id=111, utente=utenti[8], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=120, prenotazione_id=113, utente=utenti[3], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=121, prenotazione_id=113, utente=utenti[4], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=122, prenotazione_id=113, utente=utenti[6], stato='RIFIUTATO'),
        PrenotazionePartecipante(pk=123, prenotazione_id=115, utente=utenti[2], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=124, prenotazione_id=115, utente=utenti[5], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=125, prenotazione_id=117, utente=utenti[4], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=126, prenotazione_id=117, utente=utenti[3], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=127, prenotazione_id=117, utente=utenti[7], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=128, prenotazione_id=119, utente=utenti[5], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=129, prenotazione_id=119, utente=utenti[8], stato='ACCETTATO'),
        PrenotazionePartecipante(pk=130, prenotazione_id=119, utente=utenti[6], stato='RIFIUTATO'),
    ])


def reverse_seed(apps, schema_editor):
    Prenotazione = apps.get_model('Prenotazione', 'Prenotazione')
    PrenotazionePartecipante = apps.get_model('Prenotazione', 'PrenotazionePartecipante')
    PrenotazionePartecipante.objects.filter(pk__lte=16).delete()
    PrenotazionePartecipante.objects.filter(pk__gte=100).delete()
    Prenotazione.objects.filter(pk__lte=6).delete()
    Prenotazione.objects.filter(pk__gte=100).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('Prenotazione', '0001_initial'),
        ('Utente', '0003_alter_utente_ruolo'),
        ('Risorsa', '0004_remove_risorsa_attiva_risorsa_stato'),
    ]

    operations = [
        migrations.RunPython(seed_prenotazioni, reverse_seed),
    ]