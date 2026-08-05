# Uffezzi

![Contributors](https://img.shields.io/github/contributors/itShion/ITSCompanyPW)
![Issues](https://img.shields.io/github/issues/itShion/ITSCompanyPW)
![Pull Requests](https://img.shields.io/github/issues-pr/itShion/ITSCompanyPW)
![Last Commit](https://img.shields.io/github/last-commit/itShion/ITSCompanyPW)
![Top Language](https://img.shields.io/github/languages/top/itShion/ITSCompanyPW)
![Repo Size](https://img.shields.io/github/repo-size/itShion/ITSCompanyPW)

**Uffezzi** è un'applicazione web per la gestione e prenotazione delle risorse aziendali. Permette ai dipendenti di visualizzare, prenotare e gestire risorse condivise all'interno dell'azienda (come sale riunioni, attrezzature, veicoli, ecc.), centralizzando tutto in un'unica piattaforma digitale e riducendo la necessità di coordinamento manuale.

---

## 📁 Struttura del Progetto

```
ITSCompanyPW/
├── CompanyResources/        # App Django: logica di business, modelli e API
├── Frontend/
│   └── FrontendResources/   # Interfaccia utente (HTML, CSS, TypeScript)
├── fixtures/
│   └── dev_dumpdata2.json   # Dati di esempio per sviluppo e testing
├── secrets/                 # Configurazioni sensibili (non versionato)
├── manage.py                # Entry point Django
├── requirements.txt         # Dipendenze Python
├── package.json             # Dipendenze Node.js
├── Dockerfile               # Definizione immagine Docker
├── docker-compose.yml       # Orchestrazione multi-container
└── .gitignore
```

---

## 🛠️ Stack Tecnologico

| Layer      | Tecnologia                 |
|------------|----------------------------|
| Backend    | Python / Django            |
| Frontend   | TypeScript, HTML, CSS      |
| Database   | PostgreSQL (Supabase)      |
| Container  | Docker / Docker Compose    |

---

## 🚀 Guida all'Avvio

### Prerequisiti

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node Js](https://nodejs.org/en)
- [Angular](https://angular.dev/)

### 1. Clona la repository

```bash
git clone https://github.com/itShion/ITSCompanyPW.git
cd ITSCompanyPW
```

### 2. Avvia l'applicazione

```bash
docker-compose up --build
```

L'app sarà disponibile su `http://localhost` (o la porta configurata in `docker-compose.yml`).

### 3. Carica i dati di sviluppo

Accedi alla shell del container Django:

```bash
docker-compose exec django sh
```

(Opzionale) Svuota il database corrente:

```bash
python manage.py flush
```

Carica i dati di default per il testing:

```bash
python manage.py loaddata fixtures/dev_dumpdata2.json
```

### 4. Esegui le migrazioni

```bash
docker-compose exec django python manage.py migrate
```

### 5. Crea un superutente

```bash
docker-compose exec django python manage.py createsuperuser
```

---

## 🔒 Secrets

Le configurazioni sensibili (chiavi API, credenziali del database, ecc.) vanno inserite nella cartella `secrets/`. Assicurarsi che questa cartella sia inclusa nel `.gitignore` e non venga mai committata.

Il database è un'istanza [Supabase](https://supabase.com/) (PostgreSQL). Copiare `secrets/secrets.example.txt` in `secrets/secrets.txt` e compilarlo con le credenziali del proprio progetto Supabase (Project Settings → Database → Connection info), preferibilmente usando l'host del **connection pooler**.

`secrets.example.txt` elenca anche le variabili di sicurezza (`SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `DEBUG`): in locale hanno un default sensato, ma **vanno impostate esplicitamente prima di qualunque deploy reale**.

---

## 🚢 Produzione

Per un deploy reale (non lo stack di sviluppo con hot-reload) è disponibile `docker-compose.prod.yml`: Django viene servito da gunicorn (invece di `runserver`) e Angular viene compilato e servito da Nginx (invece di `ng serve`), con Nginx che fa anche da reverse proxy verso il backend.

```bash
docker compose -f docker-compose.prod.yml up --build
```

Prima di avviarlo, compilare `secrets/secrets.txt` con i valori di produzione (dominio reale in `ALLOWED_HOSTS`/`CORS_ALLOWED_ORIGINS`/`CSRF_TRUSTED_ORIGINS`, una `SECRET_KEY` generata ad hoc). `DEBUG` viene forzato a `False` dal compose file.

---

## ✅ Test e CI

```bash
# Backend
python manage.py test

# Frontend
cd Frontend/FrontendResources
npm test
npx tsc --noEmit -p tsconfig.app.json
```

Ogni Pull Request esegue automaticamente questi controlli tramite GitHub Actions (`.github/workflows/ci.yml`).
