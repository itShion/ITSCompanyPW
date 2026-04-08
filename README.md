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
| Database   | MySQL                      |
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
