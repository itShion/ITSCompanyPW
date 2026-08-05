# Sicurezza delle dipendenze

## Frontend (`npm audit`)

`npm audit` segnala 2 advisory (1 high, 1 moderate) che risultano irrisolvibili
al momento senza un downgrade:

- **undici** (usata da `@angular/build` per il fetch a build-time, es. inlining
  dei font Google) — `GHSA-8xcm-r25x-g524` e altre.
- **@hono/node-server** (usata dal server MCP incluso in `@angular/cli`, per
  l'integrazione con assistenti AI) — `GHSA-frvp-7c67-39w9`, path traversal
  su Windows.

Entrambe sono dipendenze di **tooling di build/CLI**: non vengono mai incluse
nel bundle Angular che finisce in produzione, quindi non sono raggiungibili
da un utente finale dell'applicazione. `npm audit fix --force` "risolverebbe"
il problema installando `@angular/cli@21.0.4`/`@angular/build@20.3.33`, cioè
un **downgrade** rispetto alla versione attualmente in uso (21.2.20) — non
accettabile. Verificato inoltre che anche l'ultima versione disponibile di
`@angular/cli` (22.1.3) rientra nel range segnalato come vulnerabile: non
esiste oggi una versione che risolva senza tornare indietro. Vanno
ri-controllate periodicamente (`npm audit`) in attesa di un fix a monte.

## Backend (`requirements.txt`)

Fino a `chore/pin-backend-deps`, `requirements.txt` non aveva versioni
pinnate: un requirement come `django` (senza alcun vincolo) intercetta
qualunque CVE storica di qualunque versione di Django mai pubblicata,
il che spiega gran parte de numero di alert riportato da Dependabot su
GitHub. Il pin a compatible-release (`~=`) introdotto in quella PR restringe
drasticamente il ventaglio di versioni installabili e dovrebbe ridurre
significativamente gli alert una volta mergiato — non è stato verificato con
uno scanner locale (`pip-audit`) perché in questo ambiente non è disponibile
un interprete Python funzionante; da confermare rileggendo la scheda
Security → Dependabot del repository dopo il merge.
