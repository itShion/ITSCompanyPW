

per caricare i dati:

(per accedere alla shell di django)
> docker-compose exec django sh

(per cancellare il contenuto del db corrente)
> python manage.py flush

(per caricare i dati di default per testing nel db)
> python manage.py loaddata fixtures/dev_dumpdata.json