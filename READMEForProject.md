# Guida per rookie dell'Uffezzi Group.

Da cosa partiamo?

# Github

Regole del nostro progetto:

- Mai pushare nei branch **main** e **develop**
- Ogni commit deve essere minimale , non voglio vedere pochi commit pieni di carico di lavoro senza nemmeno aver spiegato cosa avete fatto.
- Se avete lavorato su piu file, consiglio CALDAMENTE di spezzarli in piu commit , ad esempio :
```
Ho creato 2 component e messo le path in app.routes.ts.
2 Commit con:
- Cosa fa Component 1 + aggiunta del suo path.
- Cosa fa Component 2 + aggiunta del suo path.
```

## Cosa fare se non si ha ancora la repo in locale?

Andare su : **https://github.com/itShion/ITSCompanyPW**

Cliccare su "Code" e copiare il link **HTTPS** che trovate:

https://github.com/itShion/ITSCompanyPW.git

Andate nel terminale del vostro IDE ( Consiglio VSCode ) e digitate:

```shell
git init
git clone https://github.com/itShion/ITSCompanyPW.git
git branch -M main
git remote add origin https://github.com/itShion/ITSCompanyPW
```


## Ogni volta che iniziate a lavorare:

```
git status
git fetch origin
```


Questo comando va fatto quando dovete aggiornare il vostro branch con il branch remoto.
```
git pull origin
```

## Esempio:
Il vostro branch develop è indietro di commit:
```
git fetch origin
git switch develop
git pull origin
```

## Quando si crea un nuovo branch:
E' bene partire a creare il branch da **develop**:
```
git switch develop
git switch -c { nome del tuo branch }
```


## Mentre lavorate

```shell
git status
git add ( file ) oppure . se volete aggiungere tutto direttamente nell area di staging
git commit -m "il vostro messaggio"
git push
```

Ripeto, i commit devono essere sensati e spezzati.

```
git push --set-upstream origin Documentazione 
```
Quest'ultimo va fatto la prima volta che create un nuovo branch, una volta fatto questo comando , vi basterà il solito 

```
git push
```

# Altri comandi utili:

## Vedere la history/tutti i commit fatti nel branch:
```
git log --oneline
```

## Tornare indietro di qualche commit tenendo le modifiche attuali:
```
git reset --soft { il codice di quel commit }
```

Esempio: 
Attualmente sono in 2ca1558
```
2ca1558 (HEAD -> Documentazione, origin/main, origin/HEAD, main) feat: Aggiunta di Angular nel docker-compose
1d3ea30 (origin/devTest, devTest) fix: Aggiunta e refactor di gitignore
569e7de add: Nuovi pacchetti da scaricare
7761d4b feat: Utilizzo di Docker
a5aeb74 feat: Repath per usare MYSQL al posto di POSTGRES
8d3ad08 feat: Nuovi elementi da ignorare
c3f0795 Starting Point
eb3f00d Inizializzazione struttura progetto
```

Per tornare 1 commit indietro:

```
git reset --soft 1d3ea30
```

Altrimenti se volete tornare indietro senza tenere le vostre modifiche:

```
git reset --hard 1d3ea30
```

## Se mi accorgo di star lavorando nel branch sbagliato ma devo tenermi il codice che ho scritto:
```
git stash
```

Cambiate branch e poi:
```
git stash pop
```

# Infine

Quando avrete completato la vostra task e sapete che potete includerlo nel branch **develop** aprite una **_Pull Request_**
su GitHub. 

```
New Pull Request > 

base : develop <- compare: _il vostro branch_

```
E poi una descrizione di cosa avete fatto.



# Angular 

Angular lo si usa in ambito Frontend, costruito in Componenti, Servizi etc...

## Ma come si lavora con Angular?

Ogni qualvolta che dovrete fare una nuova pagina, dovrete creare il componente che rappresenta il vostro lavoro.

**Ad esempio**: In Frontend/FrontendResources/src/app:

Ci sono: **prenotazionitab** e **login** che sono due componenti.
Questi componenti verranno messi nelle routes per creare una connessione tra i vari component.

## Dove?:
in **app.routes**:

```
export const routes: Routes = [
  { path: 'prenotazionitab', component: Prenotazionitab },*
  { path: '', redirectTo: '/prenotazionitab', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'register', component: RegisterComponent},
  {path: 'prenota/:id', component:Prenota},
];
```

Qua definiamo le path per ogni componente.

# Come si crea un componente?

Nel terminale:

``` 
ng generate component { nome del componente }
```

## ATTENZIONE PERO' !

Dovete essere nella cartella giusta del progetto prima di creare ogni componente, altrimenti si creeranno casini, e voi non volete che succeda giusto? [ **Anche perchè mi incazzerei a bestia** ]

## Dove farlo:

```
ITSCompanyPW\Frontend\FrontendResources\src\app> 
```

In ogni componente , avrete 1 cartella ( nome del componente ) con :
- Un file **.css**
- Un file **.html**
- 2 file **.ts**

Typescripts:
- Dove andrete a scrivere la logica della pagina.

## Per i servizi:
Sempre tenendo conto delle regole che vi ho descritto ( i servizi vanno creati in **src>app>services** ):
```
ng generate service { nome del servizio }
```


# Come far partire il progetto?

**Il progetto gira su Docker**, quindi se non lo avete, scaricate **Docker Desktop**.
Fatelo partire ogni volta che dovete lavorare sul progetto.

E poi da terminale

```
docker-compose up -d
```

E per spegnerlo:

```
docker-compose down
```

E nel browser andate in **localhost:4200** ( Angular )
Per Django invece : **localhost:8000** ma non penso vi serva.

# Consigli
Se la pagina non risponde, aprite Docker Desktop e guardate se i 2 container hanno bollino verde, altrimenti cliccate il container che non parte e guardate cosa non va.
