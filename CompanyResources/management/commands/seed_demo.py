import random
from datetime import timedelta, datetime, date, time as dtime

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction

from CompanyResources.ActivityLog.models import ActivityLog
from CompanyResources.Notifica.models import Notifica
from CompanyResources.Prenotazione.models import Prenotazione, PrenotazionePartecipante
from CompanyResources.Risorsa.models import Risorsa, TipoRisorsa
from CompanyResources.Utente.models import Utente

NOMI = [
    "Mario", "Luigi", "Giulia", "Sara", "Marco", "Elena", "Francesco", "Chiara",
    "Andrea", "Valentina", "Luca", "Federica", "Matteo", "Alessia", "Davide",
    "Martina", "Simone", "Giorgia", "Riccardo", "Silvia", "Alessandro", "Laura",
    "Stefano", "Roberta", "Fabio", "Ilaria", "Nicola", "Serena", "Paolo", "Anna",
    "Giovanni", "Beatrice", "Antonio", "Elisa", "Roberto", "Camilla", "Gabriele",
    "Noemi", "Lorenzo", "Cristina",
]
COGNOMI = [
    "Rossi", "Bianchi", "Verdi", "Ferrari", "Russo", "Colombo", "Ricci",
    "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Mancini",
    "Costa", "Giordano", "Rizzo", "Lombardi", "Moretti", "Barbieri",
    "Fontana", "Santoro", "Mariani", "Rinaldi", "Caruso", "Ferrara",
    "Galli", "Martini", "Leone", "Longo", "Gentile", "Martinelli",
    "Vitale", "Serra", "Pellegrini", "Palumbo", "Sanna", "Farina",
    "Neri", "Marchetti",
]

MOTIVI_SALA = [
    "Riunione settimanale di team", "Colloquio candidato", "Sessione di planning sprint",
    "Presentazione cliente", "Call con fornitore", "Retrospettiva di progetto",
    "Formazione interna", "Workshop di design", "Revisione budget trimestrale",
    "Allineamento con il management",
]
MOTIVI_ATTREZZATURA = [
    "Stampa documentazione contrattuale", "Prototipazione componente",
    "Stampa materiale per fiera", "Realizzazione modello dimostrativo",
    "Stampa report mensile", "Test di stampa 3D per prototipo",
]
MOTIVI_POSTAZIONE = [
    "Attività di sviluppo", "Lavoro concentrato su documentazione",
    "Giornata di smart working in sede", "Preparazione presentazione",
    "Analisi dati e reportistica", "Attività amministrativa",
]

TIPI_RISORSA = [
    ("Sala Riunioni", "spazio prenotabile per riunioni e incontri di lavoro, con posti a sedere."),
    ("Attrezzatura", "insieme di strumenti e dispositivi prenotabili per attivita' lavorative."),
    ("Postazione", "spazio di lavoro individuale prenotabile per attivita' quotidiane."),
]

RISORSE = [
    ("Sala Riunioni Alpha", "Sala Riunioni", 15),
    ("Sala Riunioni Beta", "Sala Riunioni", 8),
    ("Sala Conferenze Nord", "Sala Riunioni", 25),
    ("Stampante Ufficio1", "Attrezzatura", 1),
    ("Stampante 3D", "Attrezzatura", 1),
    ("Proiettore Portatile", "Attrezzatura", 1),
    ("Telecamera Conferenze", "Attrezzatura", 1),
    ("Postazione1", "Postazione", 1),
    ("Postazione2", "Postazione", 1),
    ("Postazione3", "Postazione", 1),
    ("Postazione4", "Postazione", 1),
    ("Postazione5", "Postazione", 1),
]

STATI_PESI = [("CONFERMATA", 55), ("PENDING", 30), ("ANNULLATA", 15)]


def stato_random():
    tot = sum(p for _, p in STATI_PESI)
    r = random.uniform(0, tot)
    acc = 0
    for stato, peso in STATI_PESI:
        acc += peso
        if r <= acc:
            return stato
    return STATI_PESI[-1][0]


class Command(BaseCommand):
    help = "Popola il database con dati demo realistici in volume (utenti, risorse, prenotazioni, notifiche, log)."

    def add_arguments(self, parser):
        parser.add_argument("--utenti", type=int, default=40, help="Numero di utenti normali da creare")
        parser.add_argument("--responsabili", type=int, default=5, help="Numero di responsabili da creare")
        parser.add_argument("--giorni-avanti", type=int, default=29, help="Orizzonte massimo prenotazioni (max 30 consentito dal modello)")
        parser.add_argument("--tentativi-per-slot", type=int, default=6, help="Tentativi di prenotazione per combinazione utente/giorno")

    def handle(self, *args, **options):
        random.seed()
        n_utenti = options["utenti"]
        n_responsabili = options["responsabili"]
        giorni_avanti = min(options["giorni_avanti"], 29)

        with transaction.atomic():
            tipi = self._crea_tipi_risorsa()
            risorse = self._crea_risorse(tipi)
            admin, responsabili, utenti = self._crea_utenti(n_responsabili, n_utenti)

        tutti_utenti = [admin] + responsabili + utenti
        prenotazioni = self._crea_prenotazioni(tutti_utenti, risorse, giorni_avanti, options["tentativi_per_slot"])
        self._crea_partecipanti(prenotazioni, tutti_utenti)
        self._crea_notifiche_e_log(prenotazioni)

        self.stdout.write(self.style.SUCCESS(
            f"Fatto: {len(risorse)} risorse, {len(tutti_utenti)} utenti, "
            f"{len(prenotazioni)} prenotazioni create."
        ))

    def _crea_tipi_risorsa(self):
        tipi = {}
        for nome, descrizione in TIPI_RISORSA:
            tipo, _ = TipoRisorsa.objects.get_or_create(
                nome=nome, defaults={"descrizione": descrizione}
            )
            tipi[nome] = tipo
        return tipi

    def _crea_risorse(self, tipi):
        risorse = []
        for nome, tipo_nome, capacita in RISORSE:
            risorsa, _ = Risorsa.objects.get_or_create(
                nome=nome,
                defaults={
                    "descrizione": f"{tipo_nome} aziendale: {nome}",
                    "capacita": capacita,
                    "tipo": tipi[tipo_nome],
                    "stato": "ATTIVA",
                },
            )
            risorse.append(risorsa)
        return risorse

    def _crea_utenti(self, n_responsabili, n_utenti):
        usati = set()

        def username_libero(nome, cognome):
            base = f"{nome}.{cognome}".lower().replace(" ", "").replace("'", "")
            candidato = base
            i = 1
            while candidato in usati or User.objects.filter(username=candidato).exists():
                i += 1
                candidato = f"{base}{i}"
            usati.add(candidato)
            return candidato

        def crea_persona(ruolo, is_superuser=False):
            nome = random.choice(NOMI)
            cognome = random.choice(COGNOMI)
            username = username_libero(nome, cognome)
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "first_name": nome,
                    "last_name": cognome,
                    "email": f"{username}@uffezzi.demo",
                    "is_staff": is_superuser,
                    "is_superuser": is_superuser,
                },
            )
            if created:
                user.set_password("Demo12345!")
                user.save()
            utente, _ = Utente.objects.get_or_create(
                user=user,
                defaults={"ruolo": ruolo, "telefono": f"3{random.randint(100000000, 999999999)}"},
            )
            return utente

        if Utente.objects.filter(ruolo="ADMIN").exists():
            admin = Utente.objects.filter(ruolo="ADMIN").first()
        else:
            admin_user, created = User.objects.get_or_create(
                username="admin.demo",
                defaults={"is_staff": True, "is_superuser": True, "email": "admin.demo@uffezzi.demo"},
            )
            if created:
                admin_user.set_password("Demo12345!")
                admin_user.save()
            admin, _ = Utente.objects.get_or_create(
                user=admin_user, defaults={"ruolo": "ADMIN", "telefono": "3331234567"}
            )

        responsabili = [crea_persona("RESPONSABILE") for _ in range(n_responsabili)]
        utenti = [crea_persona("UTENTE") for _ in range(n_utenti)]
        return admin, responsabili, utenti

    def _motivo_per(self, risorsa):
        if risorsa.tipo.nome == "Sala Riunioni":
            return random.choice(MOTIVI_SALA)
        if risorsa.tipo.nome == "Attrezzatura":
            return random.choice(MOTIVI_ATTREZZATURA)
        return random.choice(MOTIVI_POSTAZIONE)

    def _crea_prenotazioni(self, utenti, risorse, giorni_avanti, tentativi_per_slot):
        oggi = date.today()
        durate_ore = [0.5, 1, 1.5, 2, 3, 4]
        prenotazioni = []
        occupato = {}  # (risorsa_id, giorno) -> lista di (inizio, fine)

        giorni = [oggi + timedelta(days=d) for d in range(giorni_avanti + 1)]

        for giorno in giorni:
            risorse_aperte = [r for r in risorse if r.is_open_in(giorno)]
            if not risorse_aperte:
                continue
            for utente in utenti:
                prenotazioni_oggi_utente = 0
                for _ in range(tentativi_per_slot):
                    if prenotazioni_oggi_utente >= 3:
                        break
                    if random.random() > 0.35:
                        continue
                    risorsa = random.choice(risorse_aperte)
                    durata = random.choice(durate_ore)
                    slot = self._slot_libero(risorsa, giorno, durata, occupato)
                    if slot is None:
                        continue
                    inizio, fine = slot
                    if giorno == oggi and inizio <= datetime.now():
                        continue
                    p = Prenotazione(
                        utente=utente,
                        risorsa=risorsa,
                        data_inizio=inizio,
                        data_fine=fine,
                        stato=stato_random(),
                        motivo=self._motivo_per(risorsa),
                    )
                    chiave = (risorsa.id, giorno)
                    occupato.setdefault(chiave, []).append((inizio, fine))
                    prenotazioni.append(p)
                    prenotazioni_oggi_utente += 1

        Prenotazione.objects.bulk_create(prenotazioni, batch_size=500)
        return prenotazioni

    def _slot_libero(self, risorsa, giorno, durata_ore, occupato):
        apertura = risorsa.orario_apertura
        chiusura = risorsa.orario_chiusura
        slot_minuti = 30
        inizio_minuti = apertura.hour * 60 + apertura.minute
        fine_minuti = chiusura.hour * 60 + chiusura.minute
        durata_minuti = int(durata_ore * 60)

        possibili = list(range(inizio_minuti, fine_minuti - durata_minuti + 1, slot_minuti))
        random.shuffle(possibili)

        prenotate = occupato.get((risorsa.id, giorno), [])

        for start_min in possibili:
            end_min = start_min + durata_minuti
            inizio_dt = datetime.combine(giorno, dtime(start_min // 60, start_min % 60))
            fine_dt = datetime.combine(giorno, dtime(end_min // 60, end_min % 60))
            conflitto = any(inizio_dt < f and fine_dt > i for i, f in prenotate)
            if not conflitto:
                return inizio_dt, fine_dt
        return None

    def _crea_partecipanti(self, prenotazioni, utenti):
        partecipazioni = []
        for p in prenotazioni:
            if p.risorsa.capacita <= 1 or p.stato == "ANNULLATA":
                continue
            n_partecipanti = random.randint(1, min(p.risorsa.capacita - 1, 8))
            candidati = [u for u in utenti if u.id != p.utente_id]
            partecipanti = random.sample(candidati, min(n_partecipanti, len(candidati)))
            for u in partecipanti:
                stato = random.choices(
                    ["ACCETTATO", "INVITATO", "RIFIUTATO"], weights=[60, 30, 10]
                )[0]
                partecipazioni.append(PrenotazionePartecipante(prenotazione=p, utente=u, stato=stato))
        PrenotazionePartecipante.objects.bulk_create(partecipazioni, batch_size=500, ignore_conflicts=True)

    def _crea_notifiche_e_log(self, prenotazioni):
        notifiche = []
        logs = []
        for p in prenotazioni:
            logs.append(ActivityLog(
                azione="CREATA", utente=p.utente, prenotazione=p,
                descrizione=f"{p.utente.user.username} ha creato una prenotazione per {p.risorsa.nome}",
            ))
            if p.stato == "CONFERMATA":
                notifiche.append(Notifica(
                    utente=p.utente, titolo="Prenotazione approvata",
                    messaggio=f"La tua prenotazione per {p.risorsa.nome} il {p.data_inizio.strftime('%d/%m/%Y')} e' stata approvata.",
                    tipo="BOOKING_APPROVED", letta=random.random() < 0.5,
                ))
                logs.append(ActivityLog(
                    azione="CONFERMATA", utente=p.utente, prenotazione=p,
                    descrizione=f"Prenotazione per {p.risorsa.nome} confermata",
                ))
            elif p.stato == "PENDING":
                notifiche.append(Notifica(
                    utente=p.utente, titolo="Richiesta in attesa",
                    messaggio=f"La tua richiesta per {p.risorsa.nome} il {p.data_inizio.strftime('%d/%m/%Y')} e' in attesa di approvazione.",
                    tipo="BOOKING_PENDING", letta=random.random() < 0.3,
                ))
            elif p.stato == "ANNULLATA":
                notifiche.append(Notifica(
                    utente=p.utente, titolo="Prenotazione rifiutata",
                    messaggio=f"La tua prenotazione per {p.risorsa.nome} il {p.data_inizio.strftime('%d/%m/%Y')} e' stata annullata.",
                    tipo="BOOKING_REJECTED", letta=random.random() < 0.5,
                ))
                logs.append(ActivityLog(
                    azione="ANNULLATA", utente=p.utente, prenotazione=p,
                    descrizione=f"Prenotazione per {p.risorsa.nome} annullata",
                ))

        Notifica.objects.bulk_create(notifiche, batch_size=500)
        ActivityLog.objects.bulk_create(logs, batch_size=500)
